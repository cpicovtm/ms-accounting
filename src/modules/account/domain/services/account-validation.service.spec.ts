import { BadRequestException, ConflictException, UnprocessableEntityException } from '@nestjs/common';
import { AccountValidationService } from './account-validation.service';
import { AccountNature } from '../enums/account-nature.enum';

describe('AccountValidationService', () => {
  // ═══════════════════════════════════════════
  // validateChildCode
  // ═══════════════════════════════════════════
  describe('validateChildCode', () => {
    it('should pass when child code starts with parent code', () => {
      expect(() =>
        AccountValidationService.validateChildCode('11', '1101'),
      ).not.toThrow();
    });

    it('should pass for deep hierarchy (1 → 11 → 1101 → 110101)', () => {
      expect(() =>
        AccountValidationService.validateChildCode('1101', '110101'),
      ).not.toThrow();
    });

    it('should throw when child code does not start with parent code', () => {
      expect(() =>
        AccountValidationService.validateChildCode('11', '1201'),
      ).toThrow(BadRequestException);
    });

    it('should throw when child code equals parent code', () => {
      expect(() =>
        AccountValidationService.validateChildCode('11', '11'),
      ).toThrow(BadRequestException);
    });

    it('should throw when child code is shorter than parent code', () => {
      expect(() =>
        AccountValidationService.validateChildCode('1101', '11'),
      ).toThrow(BadRequestException);
    });
  });

  // ═══════════════════════════════════════════
  // calculateLevel
  // ═══════════════════════════════════════════
  describe('calculateLevel', () => {
    it('should return level 1 for 1-digit code', () => {
      expect(AccountValidationService.calculateLevel('1')).toBe(1);
    });

    it('should return level 2 for 2-digit code', () => {
      expect(AccountValidationService.calculateLevel('11')).toBe(2);
    });

    it('should return level 3 for 4-digit code', () => {
      expect(AccountValidationService.calculateLevel('1101')).toBe(3);
    });

    it('should return level 4 for 6-digit code', () => {
      expect(AccountValidationService.calculateLevel('110101')).toBe(4);
    });

    it('should return level 5 for 8-digit code', () => {
      expect(AccountValidationService.calculateLevel('11010101')).toBe(5);
    });
  });

  // ═══════════════════════════════════════════
  // validateCodeFormat
  // ═══════════════════════════════════════════
  describe('validateCodeFormat', () => {
    it('should pass for numeric-only codes', () => {
      expect(() =>
        AccountValidationService.validateCodeFormat('110101'),
      ).not.toThrow();
    });

    it('should throw for alphanumeric codes', () => {
      expect(() =>
        AccountValidationService.validateCodeFormat('11AB01'),
      ).toThrow(BadRequestException);
    });

    it('should throw for codes with special characters', () => {
      expect(() =>
        AccountValidationService.validateCodeFormat('11-01'),
      ).toThrow(BadRequestException);
    });

    it('should throw for empty string', () => {
      expect(() =>
        AccountValidationService.validateCodeFormat(''),
      ).toThrow(BadRequestException);
    });
  });

  // ═══════════════════════════════════════════
  // validateNatureInheritance
  // ═══════════════════════════════════════════
  describe('validateNatureInheritance', () => {
    it('should pass when parent and child have same nature', () => {
      expect(() =>
        AccountValidationService.validateNatureInheritance(
          AccountNature.DEBIT,
          AccountNature.DEBIT,
        ),
      ).not.toThrow();
    });

    it('should throw when parent is DEBIT and child is CREDIT', () => {
      expect(() =>
        AccountValidationService.validateNatureInheritance(
          AccountNature.DEBIT,
          AccountNature.CREDIT,
        ),
      ).toThrow(BadRequestException);
    });

    it('should throw when parent is CREDIT and child is DEBIT', () => {
      expect(() =>
        AccountValidationService.validateNatureInheritance(
          AccountNature.CREDIT,
          AccountNature.DEBIT,
        ),
      ).toThrow(BadRequestException);
    });
  });

  // ═══════════════════════════════════════════
  // assertCanModifyProtectedField
  // ═══════════════════════════════════════════
  describe('assertCanModifyProtectedField', () => {
    it('should pass when account has no movements', () => {
      expect(() =>
        AccountValidationService.assertCanModifyProtectedField(false, 'naturaleza'),
      ).not.toThrow();
    });

    it('should throw UnprocessableEntityException when account has movements', () => {
      expect(() =>
        AccountValidationService.assertCanModifyProtectedField(true, 'naturaleza'),
      ).toThrow(UnprocessableEntityException);
    });

    it('should include field name in error message', () => {
      expect(() =>
        AccountValidationService.assertCanModifyProtectedField(true, 'tipo de cuenta'),
      ).toThrow(/tipo de cuenta/);
    });
  });

  // ═══════════════════════════════════════════
  // assertCanDeactivate
  // ═══════════════════════════════════════════
  describe('assertCanDeactivate', () => {
    it('should pass when account has no active children', () => {
      expect(() =>
        AccountValidationService.assertCanDeactivate(0),
      ).not.toThrow();
    });

    it('should throw ConflictException when account has active children', () => {
      expect(() =>
        AccountValidationService.assertCanDeactivate(3),
      ).toThrow(ConflictException);
    });

    it('should include children count in error message', () => {
      expect(() =>
        AccountValidationService.assertCanDeactivate(5),
      ).toThrow(/5/);
    });
  });

  // ═══════════════════════════════════════════
  // assertCanDelete
  // ═══════════════════════════════════════════
  describe('assertCanDelete', () => {
    it('should pass when account has no children', () => {
      expect(() =>
        AccountValidationService.assertCanDelete(0),
      ).not.toThrow();
    });

    it('should throw ConflictException when account has children', () => {
      expect(() =>
        AccountValidationService.assertCanDelete(2),
      ).toThrow(ConflictException);
    });
  });

  // ═══════════════════════════════════════════
  // assertCanDeleteWithMovements
  // ═══════════════════════════════════════════
  describe('assertCanDeleteWithMovements', () => {
    it('should pass when account has no movements', () => {
      expect(() =>
        AccountValidationService.assertCanDeleteWithMovements(false),
      ).not.toThrow();
    });

    it('should throw ConflictException when account has movements', () => {
      expect(() =>
        AccountValidationService.assertCanDeleteWithMovements(true),
      ).toThrow(ConflictException);
    });
  });

  // ═══════════════════════════════════════════
  // assertNotGroupToDetailWithChildren
  // ═══════════════════════════════════════════
  describe('assertNotGroupToDetailWithChildren', () => {
    it('should pass when converting group to detail with no children', () => {
      expect(() =>
        AccountValidationService.assertNotGroupToDetailWithChildren(false, true, 0),
      ).not.toThrow();
    });

    it('should throw when converting group to detail with children', () => {
      expect(() =>
        AccountValidationService.assertNotGroupToDetailWithChildren(false, true, 3),
      ).toThrow(ConflictException);
    });

    it('should pass when not changing to detail (detail → group)', () => {
      expect(() =>
        AccountValidationService.assertNotGroupToDetailWithChildren(true, false, 0),
      ).not.toThrow();
    });

    it('should pass when already detail and staying detail', () => {
      expect(() =>
        AccountValidationService.assertNotGroupToDetailWithChildren(true, true, 0),
      ).not.toThrow();
    });
  });
});
