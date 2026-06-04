export interface AccountAuditLogProps {
  id: string;
  accountId: string;
  action: string; // CREATE | UPDATE | DEACTIVATE | REACTIVATE
  fieldChanged: string | null;
  oldValue: string | null;
  newValue: string | null;
  changedBy: string | null;
  changedAt: Date;
}

/**
 * Registro de auditoría de cambios en el plan de cuentas.
 */
export class AccountAuditLog {
  public readonly id: string;
  public readonly accountId: string;
  public readonly action: string;
  public readonly fieldChanged: string | null;
  public readonly oldValue: string | null;
  public readonly newValue: string | null;
  public readonly changedBy: string | null;
  public readonly changedAt: Date;

  constructor(props: AccountAuditLogProps) {
    this.id = props.id;
    this.accountId = props.accountId;
    this.action = props.action;
    this.fieldChanged = props.fieldChanged;
    this.oldValue = props.oldValue;
    this.newValue = props.newValue;
    this.changedBy = props.changedBy;
    this.changedAt = props.changedAt;
  }
}
