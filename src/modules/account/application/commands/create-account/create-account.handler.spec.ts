import { BadRequestException, ConflictException } from '@nestjs/common';
import { AccountNature } from '../../../domain/enums/account-nature.enum';
import { AccountType } from '../../../domain/enums/account-type.enum';
import { InMemoryAccountRepository } from '../../../infrastructure/persistence/repositories/in-memory-account.repository';
import { InMemoryAccountAuditRepository } from '../../../infrastructure/persistence/repositories/in-memory-account-audit.repository';
import { CreateAccountCommand } from './create-account.command';
import { CreateAccountHandler } from './create-account.handler';

describe('CreateAccountHandler', () => {
  let handler: CreateAccountHandler;
  let repository: InMemoryAccountRepository;
  let auditRepository: InMemoryAccountAuditRepository;

  beforeEach(() => {
    repository = new InMemoryAccountRepository();
    auditRepository = new InMemoryAccountAuditRepository();
    handler = new CreateAccountHandler(repository, auditRepository);
  });

  const makeCommand = (overrides: Partial<ConstructorParameters<typeof CreateAccountCommand>[0]> = {}) =>
    new CreateAccountCommand({
      code: '1',
      name: 'Activo',
      parentId: null,
      accountType: AccountType.ASSET,
      nature: AccountNature.DEBIT,
      isDetail: false,
      description: null,
      ...overrides,
    });

  it('debe crear una cuenta raíz correctamente', async () => {
    const result = await handler.execute(makeCommand());

    expect(result.code).toBe('1');
    expect(result.name).toBe('Activo');
    expect(result.level).toBe(1);
    expect(result.parentId).toBeNull();
    expect(result.isActive).toBe(true);
  });

  it('debe asignar un UUID al crear la cuenta', async () => {
    const result = await handler.execute(makeCommand());
    expect(result.id).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('debe crear una cuenta hija bajo padre existente', async () => {
    // Crear padre
    const parent = await handler.execute(makeCommand({ code: '1' }));

    // Crear hijo
    const child = await handler.execute(
      makeCommand({ code: '11', parentId: parent.id, name: 'Activo Corriente' }),
    );

    expect(child.parentId).toBe(parent.id);
    expect(child.level).toBe(parent.level + 1);
  });

  it('debe lanzar ConflictException si el código ya existe', async () => {
    await handler.execute(makeCommand({ code: '1' }));

    await expect(
      handler.execute(makeCommand({ code: '1', name: 'Otro Activo' })),
    ).rejects.toThrow(ConflictException);
  });

  it('debe lanzar BadRequestException si el código es alfanumérico', async () => {
    await expect(
      handler.execute(makeCommand({ code: 'A1' })),
    ).rejects.toThrow(BadRequestException);
  });

  it('debe lanzar BadRequestException si el padre no existe', async () => {
    await expect(
      handler.execute(makeCommand({ code: '11', parentId: 'non-existent-uuid' })),
    ).rejects.toThrow(BadRequestException);
  });

  it('debe lanzar BadRequestException si el código no cuelga del padre', async () => {
    const parent = await handler.execute(makeCommand({ code: '1' }));

    await expect(
      handler.execute(makeCommand({ code: '21', parentId: parent.id })),
    ).rejects.toThrow(BadRequestException);
  });

  it('debe lanzar BadRequestException si la naturaleza del hijo difiere del padre', async () => {
    const parent = await handler.execute(
      makeCommand({ code: '2', nature: AccountNature.CREDIT, accountType: AccountType.LIABILITY }),
    );

    await expect(
      handler.execute(
        makeCommand({
          code: '21',
          parentId: parent.id,
          nature: AccountNature.DEBIT, // difiere del padre CREDIT
          accountType: AccountType.LIABILITY,
        }),
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('no debe permitir crear hijas bajo una cuenta de movimiento (isDetail=true)', async () => {
    const parent = await handler.execute(makeCommand({ code: '1', isDetail: true }));

    await expect(
      handler.execute(makeCommand({ code: '11', parentId: parent.id })),
    ).rejects.toThrow(BadRequestException);
  });

  it('debe registrar una entrada de auditoría al crear', async () => {
    const result = await handler.execute(makeCommand());
    const logs = await auditRepository.findByAccountId(result.id);

    expect(logs).toHaveLength(1);
    expect(logs[0].action).toBe('CREATE');
    expect(logs[0].accountId).toBe(result.id);
  });
});
