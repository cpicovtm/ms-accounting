import 'dotenv/config';
import { DataSource } from 'typeorm';
import { AccountOrmEntity } from '../modules/account/infrastructure/persistence/entities/account.orm-entity';
import { AccountAuditLogOrmEntity } from '../modules/account/infrastructure/persistence/entities/account-audit-log.orm-entity';

/**
 * DataSource de TypeORM para uso en CLI (migraciones).
 * Carga el .env automáticamente via dotenv/config.
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [AccountOrmEntity, AccountAuditLogOrmEntity],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
