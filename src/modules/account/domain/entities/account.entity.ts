import type { AccountNature } from '../enums/account-nature.enum';
import type { AccountType } from '../enums/account-type.enum';

export interface AccountProps {
  id: string;
  code: string;
  name: string;
  parentId: string | null;
  level: number;
  accountType: AccountType;
  nature: AccountNature;
  isDetail: boolean;
  isActive: boolean;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string | null;
  updatedBy: string | null;
}

/**
 * Entidad de dominio — Cuenta Contable.
 *
 * Representa un nodo del plan de cuentas.
 * - `isDetail = true`  → cuenta de movimiento (imputable, recibe asientos).
 * - `isDetail = false` → cuenta sumarizadora / de grupo.
 *
 * La jerarquía se modela por auto-referencia (`parentId`) y por código
 * segmentado (ej. padre "11", hijo "1101").
 */
export class Account {
  public readonly id: string;
  public readonly code: string;
  public readonly name: string;
  public readonly parentId: string | null;
  public readonly level: number;
  public readonly accountType: AccountType;
  public readonly nature: AccountNature;
  public readonly isDetail: boolean;
  public readonly isActive: boolean;
  public readonly description: string | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly createdBy: string | null;
  public readonly updatedBy: string | null;

  /** Hijas — solo se llena en queries de árbol */
  public children?: Account[];

  constructor(props: AccountProps) {
    this.id = props.id;
    this.code = props.code;
    this.name = props.name;
    this.parentId = props.parentId;
    this.level = props.level;
    this.accountType = props.accountType;
    this.nature = props.nature;
    this.isDetail = props.isDetail;
    this.isActive = props.isActive;
    this.description = props.description;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.createdBy = props.createdBy;
    this.updatedBy = props.updatedBy;
  }
}
