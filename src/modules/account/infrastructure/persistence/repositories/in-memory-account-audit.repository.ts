import type { AccountAuditLog } from '../../../domain/entities/account-audit-log.entity';
import type { IAccountAuditRepository } from '../../../domain/repositories/account-audit.repository.interface';

/**
 * Repositorio de auditoría en memoria para desarrollo y testing.
 */
export class InMemoryAccountAuditRepository implements IAccountAuditRepository {
  private readonly logs: AccountAuditLog[] = [];

  async save(log: AccountAuditLog): Promise<AccountAuditLog> {
    this.logs.push(log);
    return log;
  }

  async findByAccountId(accountId: string): Promise<AccountAuditLog[]> {
    return this.logs
      .filter((l) => l.accountId === accountId)
      .sort((a, b) => b.changedAt.getTime() - a.changedAt.getTime());
  }
}
