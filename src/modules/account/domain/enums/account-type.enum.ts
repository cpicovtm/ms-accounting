/**
 * Tipos de cuenta contable.
 * Clasificación según la naturaleza financiera del rubro.
 */
export enum AccountType {
  /** Activo — bienes y derechos */
  ASSET = 'ASSET',
  /** Pasivo — obligaciones */
  LIABILITY = 'LIABILITY',
  /** Patrimonio — capital de los socios */
  EQUITY = 'EQUITY',
  /** Ingreso — rentas y ventas */
  INCOME = 'INCOME',
  /** Gasto — erogaciones operativas */
  EXPENSE = 'EXPENSE',
  /** Cuentas de orden / contingente */
  CONTINGENT = 'CONTINGENT',
}

/** Labels en español para mostrar en el frontend */
export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  [AccountType.ASSET]: 'Activo',
  [AccountType.LIABILITY]: 'Pasivo',
  [AccountType.EQUITY]: 'Patrimonio',
  [AccountType.INCOME]: 'Ingreso',
  [AccountType.EXPENSE]: 'Gasto',
  [AccountType.CONTINGENT]: 'Orden / Contingente',
};
