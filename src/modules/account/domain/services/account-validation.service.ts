import { BadRequestException, ConflictException, UnprocessableEntityException } from '@nestjs/common';
import type { AccountNature } from '../enums/account-nature.enum';

/**
 * Servicio de validación de dominio del Plan de Cuentas.
 * Contiene reglas de negocio puras (sin dependencias de framework).
 */
export class AccountValidationService {
  /**
   * Valida que el código del hijo comience con el código del padre.
   * Ejemplo: padre "11" → hijo "1101" ✅, hijo "1201" ❌
   */
  static validateChildCode(parentCode: string, childCode: string): void {
    if (!childCode.startsWith(parentCode)) {
      throw new BadRequestException(
        `El código "${childCode}" debe comenzar con el código del padre "${parentCode}".`,
      );
    }
    if (childCode.length <= parentCode.length) {
      throw new BadRequestException(
        `El código "${childCode}" debe ser más largo que el código del padre "${parentCode}".`,
      );
    }
  }

  /**
   * Calcula el nivel jerárquico basado en la longitud del código.
   * Convención: 1 dígito → nivel 1, 2 dígitos → nivel 2, 4 dígitos → nivel 3, 6 dígitos → nivel 4.
   */
  static calculateLevel(code: string): number {
    const len = code.length;
    if (len === 1) return 1;
    if (len === 2) return 2;
    if (len === 4) return 3;
    if (len === 6) return 4;
    if (len === 8) return 5;
    // Fallback genérico para códigos más largos
    return Math.ceil(len / 2);
  }

  /**
   * Valida que el código sea numérico puro.
   */
  static validateCodeFormat(code: string): void {
    if (!/^\d+$/.test(code)) {
      throw new BadRequestException(
        `El código "${code}" debe contener solo dígitos numéricos.`,
      );
    }
  }

  /**
   * Valida coherencia de naturaleza entre padre e hijo.
   * La naturaleza del hijo debe coincidir con la del padre.
   */
  static validateNatureInheritance(
    parentNature: AccountNature,
    childNature: AccountNature,
  ): void {
    if (parentNature !== childNature) {
      throw new BadRequestException(
        `La naturaleza del hijo debe coincidir con la del padre. ` +
        `Padre: ${parentNature}, Hijo: ${childNature}.`,
      );
    }
  }

  /**
   * Verifica si se puede modificar un campo protegido.
   * Campos protegidos: nature, accountType, isDetail (true→false).
   * No se pueden cambiar si la cuenta ya tiene movimientos.
   */
  static assertCanModifyProtectedField(
    hasMovements: boolean,
    fieldName: string,
  ): void {
    if (hasMovements) {
      throw new UnprocessableEntityException(
        `No se puede modificar "${fieldName}" porque la cuenta ya tiene movimientos contables.`,
      );
    }
  }

  /**
   * Verifica si se puede desactivar una cuenta.
   * No se puede si tiene hijas activas.
   */
  static assertCanDeactivate(activeChildrenCount: number): void {
    if (activeChildrenCount > 0) {
      throw new ConflictException(
        `No se puede desactivar la cuenta porque tiene ${activeChildrenCount} cuenta(s) hija(s) activa(s).`,
      );
    }
  }

  /**
   * Verifica si se puede "eliminar" (desactivar) una cuenta.
   * No se puede si tiene hijas (activas o no).
   */
  static assertCanDelete(childrenCount: number): void {
    if (childrenCount > 0) {
      throw new ConflictException(
        `No se puede eliminar la cuenta porque tiene ${childrenCount} cuenta(s) hija(s).`,
      );
    }
  }

  /**
   * Verifica si se puede "eliminar" una cuenta con movimientos.
   */
  static assertCanDeleteWithMovements(hasMovements: boolean): void {
    if (hasMovements) {
      throw new ConflictException(
        'No se puede eliminar la cuenta porque tiene movimientos contables registrados.',
      );
    }
  }

  /**
   * Valida que una cuenta sumarizadora no se marque como de movimiento si tiene hijas.
   */
  static assertNotGroupToDetailWithChildren(
    currentIsDetail: boolean,
    newIsDetail: boolean,
    childrenCount: number,
  ): void {
    // No aplica si no está cambiando a detalle
    if (currentIsDetail || !newIsDetail) return;
    if (childrenCount > 0) {
      throw new ConflictException(
        'No se puede convertir a cuenta de movimiento porque tiene cuentas hijas.',
      );
    }
  }
}
