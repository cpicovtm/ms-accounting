/**
 * Naturaleza contable de la cuenta.
 * Determina si el saldo normal se incrementa al débito o al crédito.
 */
export enum AccountNature {
  /** Deudora — saldo normal al Debe (activos, gastos) */
  DEBIT = 'DEBIT',
  /** Acreedora — saldo normal al Haber (pasivos, patrimonio, ingresos) */
  CREDIT = 'CREDIT',
}

/** Labels en español para mostrar en el frontend */
export const ACCOUNT_NATURE_LABELS: Record<AccountNature, string> = {
  [AccountNature.DEBIT]: 'Deudora',
  [AccountNature.CREDIT]: 'Acreedora',
};
