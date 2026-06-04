import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateAccountHandler } from './application/commands/create-account/create-account.handler';
import { UpdateAccountHandler } from './application/commands/update-account/update-account.handler';
import { ToggleAccountStatusHandler } from './application/commands/toggle-account-status/toggle-account-status.handler';
import { GetAccountsHandler } from './application/queries/get-accounts/get-accounts.handler';
import { GetAccountTreeHandler } from './application/queries/get-account-tree/get-account-tree.handler';
import { GetAccountByIdHandler } from './application/queries/get-account-by-id/get-account-by-id.handler';
import { ACCOUNT_REPOSITORY } from './domain/repositories/account.repository.interface';
import { ACCOUNT_AUDIT_REPOSITORY } from './domain/repositories/account-audit.repository.interface';
import { AccountController } from './infrastructure/controllers/account.controller';
import { InMemoryAccountRepository } from './infrastructure/persistence/repositories/in-memory-account.repository';
import { InMemoryAccountAuditRepository } from './infrastructure/persistence/repositories/in-memory-account-audit.repository';
import { TypeOrmAccountRepository } from './infrastructure/persistence/repositories/typeorm-account.repository';
import { TypeOrmAccountAuditRepository } from './infrastructure/persistence/repositories/typeorm-account-audit.repository';
import { AccountOrmEntity } from './infrastructure/persistence/entities/account.orm-entity';
import { AccountAuditLogOrmEntity } from './infrastructure/persistence/entities/account-audit-log.orm-entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const CommandHandlers = [
  CreateAccountHandler,
  UpdateAccountHandler,
  ToggleAccountStatusHandler,
];

const QueryHandlers = [
  GetAccountsHandler,
  GetAccountTreeHandler,
  GetAccountByIdHandler,
];

/**
 * Swaps between InMemory (dev sin DB) y TypeORM (con PostgreSQL).
 * Controlado por la variable de entorno DATABASE_URL:
 * - Si DATABASE_URL existe → usa TypeORM
 * - Si no existe → usa InMemory
 */
@Module({
  imports: [
    CqrsModule,
    ConfigModule,
    TypeOrmModule.forFeature([AccountOrmEntity, AccountAuditLogOrmEntity]),
  ],
  controllers: [AccountController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: ACCOUNT_REPOSITORY,
      useFactory: (
        config: ConfigService,
        accountRepo: Repository<AccountOrmEntity>,
      ) => {
        const dbUrl = config.get('DATABASE_URL');
        if (dbUrl) {
          return new TypeOrmAccountRepository(accountRepo);
        }
        return new InMemoryAccountRepository();
      },
      inject: [ConfigService, getRepositoryToken(AccountOrmEntity)],
    },
    {
      provide: ACCOUNT_AUDIT_REPOSITORY,
      useFactory: (
        config: ConfigService,
        auditRepo: Repository<AccountAuditLogOrmEntity>,
      ) => {
        const dbUrl = config.get('DATABASE_URL');
        if (dbUrl) {
          return new TypeOrmAccountAuditRepository(auditRepo);
        }
        return new InMemoryAccountAuditRepository();
      },
      inject: [ConfigService, getRepositoryToken(AccountAuditLogOrmEntity)],
    },
  ],
})
export class AccountModule {}
