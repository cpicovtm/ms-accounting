import type { Account } from '../../../domain/entities/account.entity';
import type {
  IAccountQueryParams,
  IAccountRepository,
} from '../../../domain/repositories/account.repository.interface';

/**
 * Repositorio en memoria para desarrollo y testing sin base de datos.
 * La implementación con BD real usa TypeORM (TypeOrmAccountRepository).
 */
export class InMemoryAccountRepository implements IAccountRepository {
  private readonly accounts: Account[] = [];

  async save(account: Account): Promise<Account> {
    this.accounts.push(account);
    return account;
  }

  async update(account: Account): Promise<Account> {
    const index = this.accounts.findIndex((a) => a.id === account.id);
    if (index !== -1) {
      this.accounts[index] = account;
    }
    return account;
  }

  async findAll(options: IAccountQueryParams): Promise<[Account[], number]> {
    let filtered = [...this.accounts];

    // Filtrar por búsqueda (nombre o código)
    if (options.search) {
      const search = options.search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.name.toLowerCase().includes(search) ||
          a.code.toLowerCase().includes(search),
      );
    }

    // Filtrar por tipo de cuenta
    if (options.accountType) {
      filtered = filtered.filter((a) => a.accountType === options.accountType);
    }

    // Filtrar por estado
    if (options.isActive !== undefined) {
      const isActive = String(options.isActive) === 'true';
      filtered = filtered.filter((a) => a.isActive === isActive);
    }

    // Filtrar por padre
    if (options.parentId) {
      filtered = filtered.filter((a) => a.parentId === options.parentId);
    }

    // Filtrar solo cuentas de movimiento
    if (options.isDetail !== undefined) {
      const isDetail = String(options.isDetail) === 'true';
      filtered = filtered.filter((a) => a.isDetail === isDetail);
    }

    // Ordenar por código
    filtered.sort((a, b) => a.code.localeCompare(b.code));

    const total = filtered.length;
    const page = options.page || 1;
    const limit = options.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const records = filtered.slice(start, end);

    return [records, total];
  }

  async findById(id: string): Promise<Account | null> {
    return this.accounts.find((a) => a.id === id) || null;
  }

  async findByCode(code: string): Promise<Account | null> {
    return this.accounts.find((a) => a.code === code) || null;
  }

  async findAllFlat(): Promise<Account[]> {
    return [...this.accounts].sort((a, b) => a.code.localeCompare(b.code));
  }

  async countActiveChildren(parentId: string): Promise<number> {
    return this.accounts.filter(
      (a) => a.parentId === parentId && a.isActive,
    ).length;
  }

  async countChildren(parentId: string): Promise<number> {
    return this.accounts.filter((a) => a.parentId === parentId).length;
  }

  async hasMovements(_accountId: string): Promise<boolean> {
    // Retorna false hasta que exista el módulo de asientos contables
    return false;
  }
}
