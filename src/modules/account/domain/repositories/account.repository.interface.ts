import type { IPaginationQueryParams } from '../../../../shared/helpers/pagination-result.helper';
import type { Account } from '../entities/account.entity';
import type { AccountType } from '../enums/account-type.enum';

export const ACCOUNT_REPOSITORY = Symbol('ACCOUNT_REPOSITORY');

export interface IAccountQueryParams extends IPaginationQueryParams {
  /** Filtrar por tipo de cuenta */
  accountType?: AccountType;
  /** Filtrar por estado activo/inactivo */
  isActive?: boolean;
  /** Filtrar hijas de un padre específico */
  parentId?: string;
  /** Filtrar solo cuentas de movimiento */
  isDetail?: boolean;
}

export interface IAccountRepository {
  /** Persistir una cuenta (crear) */
  save(account: Account): Promise<Account>;

  /** Actualizar una cuenta existente */
  update(account: Account): Promise<Account>;

  /** Listar cuentas con paginación y filtros */
  findAll(options: IAccountQueryParams): Promise<[Account[], number]>;

  /** Buscar una cuenta por ID */
  findById(id: string): Promise<Account | null>;

  /** Buscar una cuenta por código */
  findByCode(code: string): Promise<Account | null>;

  /** Obtener todas las cuentas (para construir el árbol) */
  findAllFlat(): Promise<Account[]>;

  /** Contar hijas directas activas de una cuenta */
  countActiveChildren(parentId: string): Promise<number>;

  /** Contar hijas directas (activas o no) de una cuenta */
  countChildren(parentId: string): Promise<number>;

  /**
   * Verificar si la cuenta tiene movimientos contables.
   * Retorna false mientras no exista el módulo de asientos.
   */
  hasMovements(accountId: string): Promise<boolean>;
}
