import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginationResult } from '../../../../../shared/helpers/pagination-result.helper';
import {
  type IAccountRepository,
  ACCOUNT_REPOSITORY,
} from '../../../domain/repositories/account.repository.interface';
import { GetAccountsQuery } from './get-accounts.query';
import { AccountVm } from './account.vm';

@QueryHandler(GetAccountsQuery)
export class GetAccountsHandler
  implements IQueryHandler<GetAccountsQuery, PaginationResult<AccountVm>>
{
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly repository: IAccountRepository,
  ) {}

  async execute(
    query: GetAccountsQuery,
  ): Promise<PaginationResult<AccountVm>> {
    const { params } = query;
    const [accounts, total] = await this.repository.findAll(params);

    const records = accounts.map((a) => AccountVm.fromEntity(a));

    return new PaginationResult<AccountVm>({
      records,
      total,
      page: params.page || 1,
      limit: params.limit || 10,
    });
  }
}
