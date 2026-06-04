import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
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
import { UpdateAccountCommand } from './update-account.command';

@CommandHandler(UpdateAccountCommand)
export class UpdateAccountHandler
  implements ICommandHandler<UpdateAccountCommand>
{
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly repository: IAccountRepository,
    @Inject(ACCOUNT_AUDIT_REPOSITORY)
    private readonly auditRepository: IAccountAuditRepository,
  ) {}

  async execute(command: UpdateAccountCommand): Promise<Account> {
    const existing = await this.repository.findById(command.id);
    if (!existing) {
      throw new NotFoundException(
        `La cuenta con ID "${command.id}" no existe.`,
      );
    }

    const hasMovements = await this.repository.hasMovements(command.id);
    const now = new Date();
    const changes: { field: string; oldValue: string; newValue: string }[] = [];

    // ── Verificar campos protegidos si se están cambiando ──────────────────
    if (command.nature !== undefined && command.nature !== existing.nature) {
      AccountValidationService.assertCanModifyProtectedField(hasMovements, 'naturaleza');
      changes.push({ field: 'nature', oldValue: existing.nature, newValue: command.nature });
    }

    if (command.accountType !== undefined && command.accountType !== existing.accountType) {
      AccountValidationService.assertCanModifyProtectedField(hasMovements, 'tipo de cuenta');
      changes.push({ field: 'accountType', oldValue: existing.accountType, newValue: command.accountType });
    }

    if (command.isDetail !== undefined && command.isDetail !== existing.isDetail) {
      // No se puede cambiar de movimiento a sumarizadora si tiene movimientos
      if (existing.isDetail && !command.isDetail) {
        AccountValidationService.assertCanModifyProtectedField(hasMovements, 'tipo (movimiento → sumarizadora)');
      }
      // No se puede cambiar a movimiento si tiene hijas
      const childrenCount = await this.repository.countChildren(command.id);
      AccountValidationService.assertNotGroupToDetailWithChildren(
        existing.isDetail,
        command.isDetail,
        childrenCount,
      );
      changes.push({ field: 'isDetail', oldValue: String(existing.isDetail), newValue: String(command.isDetail) });
    }

    if (command.name !== existing.name) {
      changes.push({ field: 'name', oldValue: existing.name, newValue: command.name });
    }

    if (command.description !== undefined && command.description !== existing.description) {
      changes.push({ field: 'description', oldValue: existing.description || '', newValue: command.description || '' });
    }

    // ── Cambio de padre ────────────────────────────────────────────────────
    // `command.parentId` puede ser:
    //   undefined  → sin cambio (no se envió en el body)
    //   null       → se quiere convertir en raíz
    //   string     → se quiere asignar un nuevo padre
    let newParentId = existing.parentId;
    let newLevel = existing.level;

    const parentChanged = command.parentId !== undefined && command.parentId !== existing.parentId;
    if (parentChanged) {
      if (command.parentId !== null) {
        // Verificar que el nuevo padre existe
        const newParent = await this.repository.findById(command.parentId as string);
        if (!newParent) {
          throw new NotFoundException(
            `El padre con ID "${command.parentId}" no existe.`,
          );
        }

        // El nuevo padre no puede ser cuenta de movimiento (imputable)
        if (newParent.isDetail) {
          throw new BadRequestException(
            'Una cuenta de movimiento (imputable) no puede ser padre de otra cuenta.',
          );
        }

        // Evitar ciclos: el nuevo padre no puede ser un descendiente de la cuenta actual
        await this.assertNoCycle(command.id, command.parentId as string);

        newParentId = command.parentId as string;
        newLevel = newParent.level + 1;
      } else {
        // Convertir en raíz
        newParentId = null;
        newLevel = 1;
      }

      changes.push({
        field: 'parentId',
        oldValue: existing.parentId || '(raíz)',
        newValue: (command.parentId as string | null) || '(raíz)',
      });
    }

    // ── Construir la entidad actualizada ────────────────────────────────────
    const updated = new Account({
      ...existing,
      name: command.name,
      accountType: command.accountType ?? existing.accountType,
      nature: command.nature ?? existing.nature,
      isDetail: command.isDetail ?? existing.isDetail,
      description: command.description !== undefined ? command.description : existing.description,
      parentId: newParentId,
      level: newLevel,
      updatedAt: now,
      updatedBy: null, // TODO: extraer del JWT
    });

    const saved = await this.repository.update(updated);

    // ── Registrar auditoría para cada campo cambiado ────────────────────────
    for (const change of changes) {
      await this.auditRepository.save(
        new AccountAuditLog({
          id: uuidv4(),
          accountId: saved.id,
          action: 'UPDATE',
          fieldChanged: change.field,
          oldValue: change.oldValue,
          newValue: change.newValue,
          changedBy: null,
          changedAt: now,
        }),
      );
    }

    return saved;
  }

  /**
   * Verifica que `candidateParentId` NO sea descendiente de `accountId`.
   * Si lo fuera se crearía un ciclo en el árbol.
   */
  private async assertNoCycle(accountId: string, candidateParentId: string): Promise<void> {
    // Recorremos hacia arriba desde candidateParentId; si en algún momento
    // llegamos a accountId, hay ciclo.
    let currentId: string | null = candidateParentId;
    while (currentId !== null) {
      if (currentId === accountId) {
        throw new BadRequestException(
          'No se puede asignar como padre a un descendiente de la propia cuenta (se formaría un ciclo).',
        );
      }
      const node = await this.repository.findById(currentId);
      currentId = node?.parentId ?? null;
    }
  }
}
