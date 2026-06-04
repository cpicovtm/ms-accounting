import { Body, Controller, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import type { PaginationResult } from '../../../../shared/helpers/pagination-result.helper';
import { CreateAccountCommand } from '../../application/commands/create-account/create-account.command';
import { CreateAccountDto } from '../../application/commands/create-account/create-account.dto';
import { UpdateAccountCommand } from '../../application/commands/update-account/update-account.command';
import { UpdateAccountDto } from '../../application/commands/update-account/update-account.dto';
import { ToggleAccountStatusCommand } from '../../application/commands/toggle-account-status/toggle-account-status.command';
import { GetAccountsQuery } from '../../application/queries/get-accounts/get-accounts.query';
import type { AccountVm } from '../../application/queries/get-accounts/account.vm';
import { GetAccountTreeQuery } from '../../application/queries/get-account-tree/get-account-tree.query';
import type { AccountTreeNodeVm } from '../../application/queries/get-account-tree/account-tree-node.vm';
import { GetAccountByIdQuery } from '../../application/queries/get-account-by-id/get-account-by-id.query';
import type { IAccountQueryParams } from '../../domain/repositories/account.repository.interface';

@Controller('account')
export class AccountController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() dto: CreateAccountDto) {
    return this.commandBus.execute(
      new CreateAccountCommand({
        code: dto.code,
        name: dto.name,
        parentId: dto.parentId,
        accountType: dto.accountType,
        nature: dto.nature,
        isDetail: dto.isDetail,
        description: dto.description,
      }),
    );
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAccountDto) {
    return this.commandBus.execute(
      new UpdateAccountCommand({
        id,
        name: dto.name,
        accountType: dto.accountType,
        nature: dto.nature,
        isDetail: dto.isDetail,
        description: dto.description,
      }),
    );
  }

  @Patch(':id/status')
  async toggleStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.commandBus.execute(
      new ToggleAccountStatusCommand({ id, isActive }),
    );
  }

  @Get('tree')
  async getTree(): Promise<AccountTreeNodeVm[]> {
    return this.queryBus.execute(new GetAccountTreeQuery());
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AccountVm> {
    return this.queryBus.execute(new GetAccountByIdQuery(id));
  }

  @Get()
  async findAll(
    @Query() query: IAccountQueryParams,
  ): Promise<PaginationResult<AccountVm>> {
    return this.queryBus.execute(new GetAccountsQuery(query));
  }
}
