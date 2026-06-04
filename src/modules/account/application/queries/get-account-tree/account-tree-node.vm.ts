export class AccountTreeNodeVm {
  id!: string;
  code!: string;
  name!: string;
  level!: number;
  accountType!: string;
  nature!: string;
  isDetail!: boolean;
  isActive!: boolean;
  children!: AccountTreeNodeVm[];
}
