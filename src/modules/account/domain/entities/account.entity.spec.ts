import { Account } from './account.entity';
import { AccountNature } from '../enums/account-nature.enum';
import { AccountType } from '../enums/account-type.enum';

describe('Account entity', () => {
  const makeProps = (overrides: Partial<ConstructorParameters<typeof Account>[0]> = {}) => ({
    id: 'test-uuid-1',
    code: '1101',
    name: 'Caja General',
    parentId: '11-uuid',
    level: 3,
    accountType: AccountType.ASSET,
    nature: AccountNature.DEBIT,
    isDetail: true,
    isActive: true,
    description: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: null,
    updatedBy: null,
    ...overrides,
  });

  it('debe construirse correctamente con todos los props', () => {
    const props = makeProps();
    const account = new Account(props);

    expect(account.id).toBe('test-uuid-1');
    expect(account.code).toBe('1101');
    expect(account.name).toBe('Caja General');
    expect(account.parentId).toBe('11-uuid');
    expect(account.level).toBe(3);
    expect(account.accountType).toBe(AccountType.ASSET);
    expect(account.nature).toBe(AccountNature.DEBIT);
    expect(account.isDetail).toBe(true);
    expect(account.isActive).toBe(true);
    expect(account.description).toBeNull();
  });

  it('debe aceptar cuenta raíz (parentId null)', () => {
    const account = new Account(makeProps({ parentId: null, level: 1, code: '1' }));
    expect(account.parentId).toBeNull();
    expect(account.level).toBe(1);
  });

  it('debe aceptar cuenta sumarizadora (isDetail false)', () => {
    const account = new Account(makeProps({ isDetail: false }));
    expect(account.isDetail).toBe(false);
  });

  it('debe aceptar cuenta inactiva', () => {
    const account = new Account(makeProps({ isActive: false }));
    expect(account.isActive).toBe(false);
  });

  it('debe aceptar descripción opcional', () => {
    const account = new Account(makeProps({ description: 'Cuenta de efectivo en caja' }));
    expect(account.description).toBe('Cuenta de efectivo en caja');
  });

  it('debe inicializar children como undefined por defecto', () => {
    const account = new Account(makeProps());
    expect(account.children).toBeUndefined();
  });

  it('debe permitir asignar children para vista de árbol', () => {
    const account = new Account(makeProps());
    const child = new Account(makeProps({ id: 'child-uuid', code: '110101', level: 4 }));
    account.children = [child];
    expect(account.children).toHaveLength(1);
    expect(account.children![0].code).toBe('110101');
  });

  it('debe mapear correctamente las fechas de auditoría', () => {
    const created = new Date('2024-01-15T10:00:00Z');
    const updated = new Date('2024-02-20T15:30:00Z');
    const account = new Account(makeProps({ createdAt: created, updatedAt: updated }));
    expect(account.createdAt).toEqual(created);
    expect(account.updatedAt).toEqual(updated);
  });

  it('debe aceptar todos los tipos de cuenta', () => {
    for (const type of Object.values(AccountType)) {
      const account = new Account(makeProps({ accountType: type }));
      expect(account.accountType).toBe(type);
    }
  });

  it('debe aceptar ambas naturalezas (DEBIT y CREDIT)', () => {
    const debit = new Account(makeProps({ nature: AccountNature.DEBIT }));
    const credit = new Account(makeProps({ nature: AccountNature.CREDIT }));
    expect(debit.nature).toBe(AccountNature.DEBIT);
    expect(credit.nature).toBe(AccountNature.CREDIT);
  });
});
