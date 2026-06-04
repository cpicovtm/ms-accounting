import type { AccountNature } from '../../../domain/enums/account-nature.enum';
import type { AccountType } from '../../../domain/enums/account-type.enum';

export class UpdateAccountCommand {
  public readonly id: string;
  public readonly name: string;
  public readonly accountType?: AccountType;
  public readonly nature?: AccountNature;
  public readonly isDetail?: boolean;
  public readonly description?: string;
  public readonly parentId?: string | null;

  constructor(props: {
    id: string;
    name: string;
    accountType?: AccountType;
    nature?: AccountNature;
    isDetail?: boolean;
    description?: string;
    parentId?: string | null;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.accountType = props.accountType;
    this.nature = props.nature;
    this.isDetail = props.isDetail;
    this.description = props.description;
    this.parentId = props.parentId;
  }
}
