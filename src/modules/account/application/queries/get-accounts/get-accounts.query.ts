import type { IAccountQueryParams } from '../../../domain/repositories/account.repository.interface';

export class GetAccountsQuery {
  public readonly params: IAccountQueryParams;

  constructor(params: IAccountQueryParams) {
    this.params = {
      ...params,
      page: params.page ? Number(params.page) : 1,
      limit: params.limit ? Number(params.limit) : 10,
    };
  }
}
