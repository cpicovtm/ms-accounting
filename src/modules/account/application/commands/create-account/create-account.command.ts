import type { AccountNature } from '../../../domain/enums/account-nature.enum';
import type { AccountType } from '../../../domain/enums/account-type.enum';

export class CreateAccountCommand {
  public readonly code: string;
  public readonly name: string;
  public readonly parentId: string | null;
  public readonly accountType: AccountType;
  public readonly nature: AccountNature;
  public readonly isDetail: boolean;
  public readonly description: string | null;

  constructor(props: {
    code: string;
    name: string;
    parentId?: string;
    accountType: AccountType;
    nature: AccountNature;
    isDetail: boolean;
    description?: string;
  }) {
    this.code = props.code;
    this.name = props.name;
    this.parentId = props.parentId || null;
    this.accountType = props.accountType;
    this.nature = props.nature;
    this.isDetail = props.isDetail;
    this.description = props.description || null;
  }
}
