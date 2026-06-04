import { Inject, NotFoundException } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  type IAccountRepository,
  ACCOUNT_REPOSITORY,
} from '../../../domain/repositories/account.repository.interface';
import { AccountVm } from '../get-accounts/account.vm';
import { GetAccountByIdQuery } from './get-account-by-id.query';

@QueryHandler(GetAccountByIdQuery)
export class GetAccountByIdHandler
  implements IQueryHandler<GetAccountByIdQuery, AccountVm>
{
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly repository: IAccountRepository,
  ) {}

  async execute(query: GetAccountByIdQuery): Promise<AccountVm> {
    const account = await this.repository.findById(query.id);
    if (!account) {
      throw new NotFoundException(
        `La cuenta con ID "${query.id}" no fue encontrada.`,
      );
    }
    return AccountVm.fromEntity(account);
  }
}
