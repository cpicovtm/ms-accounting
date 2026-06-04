import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { Account } from '../../../domain/entities/account.entity';
import { AccountAuditLog } from '../../../domain/entities/account-audit-log.entity';
import {
  type IAccountRepository,
  ACCOUNT_REPOSITORY,
} from '../../../domain/repositories/account.repository.interface';
import {
  type IAccountAuditRepository,
  ACCOUNT_AUDIT_REPOSITORY,
} from '../../../domain/repositories/account-audit.repository.interface';
import { AccountValidationService } from '../../../domain/services/account-validation.service';
import { ToggleAccountStatusCommand } from './toggle-account-status.command';

@CommandHandler(ToggleAccountStatusCommand)
export class ToggleAccountStatusHandler
  implements ICommandHandler<ToggleAccountStatusCommand>
{
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly repository: IAccountRepository,
    @Inject(ACCOUNT_AUDIT_REPOSITORY)
    private readonly auditRepository: IAccountAuditRepository,
  ) {}

  async execute(command: ToggleAccountStatusCommand): Promise<Account> {
    const existing = await this.repository.findById(command.id);
    if (!existing) {
      throw new NotFoundException(
        `La cuenta con ID "${command.id}" no existe.`,
      );
    }

    const now = new Date();

    // Si se está desactivando, validar que no tenga hijas activas ni movimientos
    if (!command.isActive) {
      const activeChildren = await this.repository.countActiveChildren(command.id);
      AccountValidationService.assertCanDeactivate(activeChildren);

      const hasMovements = await this.repository.hasMovements(command.id);
      AccountValidationService.assertCanDeleteWithMovements(hasMovements);
    }

    const updated = new Account({
      ...existing,
      isActive: command.isActive,
      updatedAt: now,
      updatedBy: null,
    });

    const saved = await this.repository.update(updated);

    // Auditoría
    await this.auditRepository.save(
      new AccountAuditLog({
        id: uuidv4(),
        accountId: saved.id,
        action: command.isActive ? 'REACTIVATE' : 'DEACTIVATE',
        fieldChanged: 'isActive',
        oldValue: String(existing.isActive),
        newValue: String(command.isActive),
        changedBy: null,
        changedAt: now,
      }),
    );

    return saved;
  }
}
