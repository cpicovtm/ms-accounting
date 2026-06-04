import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountAuditLog } from '../../../domain/entities/account-audit-log.entity';
import type { IAccountAuditRepository } from '../../../domain/repositories/account-audit.repository.interface';
import { AccountAuditLogOrmEntity } from '../entities/account-audit-log.orm-entity';

/**
 * Implementación de IAccountAuditRepository con TypeORM + PostgreSQL.
 */
@Injectable()
export class TypeOrmAccountAuditRepository implements IAccountAuditRepository {
  constructor(
    @InjectRepository(AccountAuditLogOrmEntity)
    private readonly repo: Repository<AccountAuditLogOrmEntity>,
  ) {}

  async save(log: AccountAuditLog): Promise<AccountAuditLog> {
    const entity = this.toOrmEntity(log);
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async findByAccountId(accountId: string): Promise<AccountAuditLog[]> {
    const records = await this.repo.find({
      where: { accountId },
      order: { changedAt: 'DESC' },
    });
    return records.map((r) => this.toDomain(r));
  }

  private toOrmEntity(log: AccountAuditLog): AccountAuditLogOrmEntity {
    const entity = new AccountAuditLogOrmEntity();
    entity.id = log.id;
    entity.accountId = log.accountId;
    entity.action = log.action;
    entity.fieldChanged = log.fieldChanged;
    entity.oldValue = log.oldValue;
    entity.newValue = log.newValue;
    entity.changedBy = log.changedBy;
    entity.changedAt = log.changedAt;
    return entity;
  }

  private toDomain(record: AccountAuditLogOrmEntity): AccountAuditLog {
    return new AccountAuditLog({
      id: record.id,
      accountId: record.accountId,
      action: record.action,
      fieldChanged: record.fieldChanged,
      oldValue: record.oldValue,
      newValue: record.newValue,
      changedBy: record.changedBy,
      changedAt: record.changedAt,
    });
  }
}
