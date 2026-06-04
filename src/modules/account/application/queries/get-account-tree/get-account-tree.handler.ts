import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  type IAccountRepository,
  ACCOUNT_REPOSITORY,
} from '../../../domain/repositories/account.repository.interface';
import type { Account } from '../../../domain/entities/account.entity';
import { GetAccountTreeQuery } from './get-account-tree.query';
import type { AccountTreeNodeVm } from './account-tree-node.vm';

@QueryHandler(GetAccountTreeQuery)
export class GetAccountTreeHandler
  implements IQueryHandler<GetAccountTreeQuery, AccountTreeNodeVm[]>
{
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly repository: IAccountRepository,
  ) {}

  async execute(_query: GetAccountTreeQuery): Promise<AccountTreeNodeVm[]> {
    const allAccounts = await this.repository.findAllFlat();
    return this.buildTree(allAccounts);
  }

  /**
   * Construye el árbol jerárquico a partir de la lista plana de cuentas.
   * Las cuentas sin `parentId` son las raíces.
   */
  private buildTree(accounts: Account[]): AccountTreeNodeVm[] {
    const map = new Map<string, AccountTreeNodeVm>();

    // Primero, crear todos los nodos
    for (const account of accounts) {
      map.set(account.id, {
        id: account.id,
        code: account.code,
        name: account.name,
        level: account.level,
        accountType: account.accountType,
        nature: account.nature,
        isDetail: account.isDetail,
        isActive: account.isActive,
        children: [],
      });
    }

    const roots: AccountTreeNodeVm[] = [];

    // Segundo, conectar padres con hijos
    for (const account of accounts) {
      const node = map.get(account.id)!;
      if (account.parentId && map.has(account.parentId)) {
        map.get(account.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    }

    // Ordenar por código en cada nivel
    this.sortTreeByCode(roots);

    return roots;
  }

  private sortTreeByCode(nodes: AccountTreeNodeVm[]): void {
    nodes.sort((a, b) => a.code.localeCompare(b.code));
    for (const node of nodes) {
      if (node.children.length > 0) {
        this.sortTreeByCode(node.children);
      }
    }
  }
}
