import type { AccountAuditLog } from '../entities/account-audit-log.entity';

export const ACCOUNT_AUDIT_REPOSITORY = Symbol('ACCOUNT_AUDIT_REPOSITORY');

export interface IAccountAuditRepository {
  /** Registrar una entrada de auditoría */
  save(log: AccountAuditLog): Promise<AccountAuditLog>;

  /** Obtener historial de cambios de una cuenta */
  findByAccountId(accountId: string): Promise<AccountAuditLog[]>;
}
