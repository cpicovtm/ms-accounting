import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Account } from '../../../domain/entities/account.entity';
import type {
  IAccountQueryParams,
  IAccountRepository,
} from '../../../domain/repositories/account.repository.interface';
import { AccountOrmEntity } from '../entities/account.orm-entity';

/**
 * Implementación de IAccountRepository con TypeORM + PostgreSQL.
 */
@Injectable()
export class TypeOrmAccountRepository implements IAccountRepository {
  constructor(
    @InjectRepository(AccountOrmEntity)
    private readonly repo: Repository<AccountOrmEntity>,
  ) {}

  async save(account: Account): Promise<Account> {
    const entity = this.toOrmEntity(account);
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async update(account: Account): Promise<Account> {
    await this.repo.update(account.id, {
      name: account.name,
      accountType: account.accountType,
      nature: account.nature,
      isDetail: account.isDetail,
      isActive: account.isActive,
      description: account.description,
      updatedBy: account.updatedBy,
    });
    const updated = await this.repo.findOneOrFail({ where: { id: account.id } });
    return this.toDomain(updated);
  }

  async findAll(options: IAccountQueryParams): Promise<[Account[], number]> {
    const where: any[] = [{}];

    if (options.search) {
      // OR between name and code with case-insensitive like
      const base: any = {};
      if (options.accountType) base.accountType = options.accountType;
      if (options.isActive !== undefined && options.isActive !== null)
        base.isActive = String(options.isActive) === 'true';
      if (options.parentId) base.parentId = options.parentId;
      if (options.isDetail !== undefined && options.isDetail !== null)
        base.isDetail = String(options.isDetail) === 'true';

      where.splice(0, 1,
        { ...base, name: ILike(`%${options.search}%`) },
        { ...base, code: ILike(`%${options.search}%`) },
      );
    } else {
      const clause: any = {};
      if (options.accountType) clause.accountType = options.accountType;
      if (options.isActive !== undefined && options.isActive !== null)
        clause.isActive = String(options.isActive) === 'true';
      if (options.parentId) clause.parentId = options.parentId;
      if (options.isDetail !== undefined && options.isDetail !== null)
        clause.isDetail = String(options.isDetail) === 'true';
      where[0] = clause;
    }

    const page = options.page || 1;
    const limit = options.limit || 10;

    const [records, total] = await this.repo.findAndCount({
      where,
      order: { code: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return [records.map((r) => this.toDomain(r)), total];
  }

  async findById(id: string): Promise<Account | null> {
    const record = await this.repo.findOne({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async findByCode(code: string): Promise<Account | null> {
    const record = await this.repo.findOne({ where: { code } });
    return record ? this.toDomain(record) : null;
  }

  async findAllFlat(): Promise<Account[]> {
    const records = await this.repo.find({ order: { code: 'ASC' } });
    return records.map((r) => this.toDomain(r));
  }

  async countActiveChildren(parentId: string): Promise<number> {
    return this.repo.count({ where: { parentId, isActive: true } });
  }

  async countChildren(parentId: string): Promise<number> {
    return this.repo.count({ where: { parentId } });
  }

  async hasMovements(_accountId: string): Promise<boolean> {
    // Stub: retorna false hasta que exista el módulo de asientos
    return false;
  }

  private toOrmEntity(account: Account): AccountOrmEntity {
    const entity = new AccountOrmEntity();
    entity.id = account.id;
    entity.code = account.code;
    entity.name = account.name;
    entity.parentId = account.parentId;
    entity.level = account.level;
    entity.accountType = account.accountType;
    entity.nature = account.nature;
    entity.isDetail = account.isDetail;
    entity.isActive = account.isActive;
    entity.description = account.description;
    entity.createdBy = account.createdBy;
    entity.updatedBy = account.updatedBy;
    return entity;
  }

  private toDomain(record: AccountOrmEntity): Account {
    return new Account({
      id: record.id,
      code: record.code,
      name: record.name,
      parentId: record.parentId,
      level: record.level,
      accountType: record.accountType as any,
      nature: record.nature as any,
      isDetail: record.isDetail,
      isActive: record.isActive,
      description: record.description,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      createdBy: record.createdBy,
      updatedBy: record.updatedBy,
    });
  }
}
