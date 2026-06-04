import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig } from './shared/config/app.config';
import { validate } from './shared/config/env.validation';
import { AccountModule } from './modules/account/account.module';
import { AccountOrmEntity } from './modules/account/infrastructure/persistence/entities/account.orm-entity';
import { AccountAuditLogOrmEntity } from './modules/account/infrastructure/persistence/entities/account-audit-log.orm-entity';

/**
 * TypeORM se registra siempre, pero con retryAttempts=0 cuando no hay DATABASE_URL.
 * En ese caso los repositorios InMemory se seleccionan automáticamente en AccountModule.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      load: [appConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbUrl = config.get<string>('DATABASE_URL');
        const isProd = config.get<string>('NODE_ENV') === 'PROD';

        return {
          type: 'postgres',
          url: dbUrl,
          entities: [AccountOrmEntity, AccountAuditLogOrmEntity],
          migrations: ['dist/database/migrations/*.js'],
          synchronize: false,
          autoLoadEntities: true,
          // Si no hay DATABASE_URL no intentar conectar
          ...(dbUrl
            ? {
                ssl: isProd ? { rejectUnauthorized: false } : false,
                retryAttempts: 5,
                retryDelay: 3000,
              }
            : {
                retryAttempts: 0,
                connectTimeoutMS: 0,
              }),
        };
      },
    }),
    AccountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
