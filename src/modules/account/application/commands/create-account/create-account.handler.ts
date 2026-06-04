import { BadRequestException, ConflictException, Inject } from '@nestjs/common';
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
import { CreateAccountCommand } from './create-account.command';

@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler
  implements ICommandHandler<CreateAccountCommand>
{
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly repository: IAccountRepository,
    @Inject(ACCOUNT_AUDIT_REPOSITORY)
    private readonly auditRepository: IAccountAuditRepository,
  ) {}

  async execute(command: CreateAccountCommand): Promise<Account> {
    // 1. Validar formato de código
    AccountValidationService.validateCodeFormat(command.code);

    // 2. Verificar que el código no exista
    const existing = await this.repository.findByCode(command.code);
    if (existing) {
      throw new ConflictException(
        `Ya existe una cuenta con el código "${command.code}".`,
      );
    }

    // 3. Si tiene padre, validar jerarquía
    let level = AccountValidationService.calculateLevel(command.code);
    if (command.parentId) {
      const parent = await this.repository.findById(command.parentId);
      if (!parent) {
        throw new BadRequestException(
          `La cuenta padre con ID "${command.parentId}" no existe.`,
        );
      }

      // Validar que el código del hijo cuelgue del padre
      AccountValidationService.validateChildCode(parent.code, command.code);

      // Validar coherencia de naturaleza
      AccountValidationService.validateNatureInheritance(
        parent.nature,
        command.nature,
      );

      // Una cuenta padre (sumarizadora) no puede ser de movimiento
      if (parent.isDetail) {
        throw new BadRequestException(
          'No se pueden crear cuentas hijas bajo una cuenta de movimiento (imputable). ' +
          'La cuenta padre debe ser sumarizadora.',
        );
      }

      level = parent.level + 1;
    } else {
      // Cuenta raíz (nivel 1)
      level = 1;
    }

    // 4. Crear la entidad
    const now = new Date();
    const account = new Account({
      id: uuidv4(),
      code: command.code,
      name: command.name,
      parentId: command.parentId,
      level,
      accountType: command.accountType,
      nature: command.nature,
      isDetail: command.isDetail,
      isActive: true,
      description: command.description,
      createdAt: now,
      updatedAt: now,
      createdBy: null, // TODO: extraer del JWT cuando haya auth
      updatedBy: null,
    });

    // 5. Persistir
    const saved = await this.repository.save(account);

    // 6. Auditoría
    await this.auditRepository.save(
      new AccountAuditLog({
        id: uuidv4(),
        accountId: saved.id,
        action: 'CREATE',
        fieldChanged: null,
        oldValue: null,
        newValue: JSON.stringify({
          code: saved.code,
          name: saved.name,
          accountType: saved.accountType,
          nature: saved.nature,
          isDetail: saved.isDetail,
        }),
        changedBy: null,
        changedAt: now,
      }),
    );

    return saved;
  }
}
