import type { Account } from '../../../domain/entities/account.entity';

/**
 * ViewModel para la respuesta de cuentas.
 * Copia plana de los campos relevantes de la entidad.
 */
export class AccountVm {
  id!: string;
  code!: string;
  name!: string;
  parentId!: string | null;
  level!: number;
  accountType!: string;
  nature!: string;
  isDetail!: boolean;
  isActive!: boolean;
  description!: string | null;
  createdAt!: string;
  updatedAt!: string;

  static fromEntity(entity: Account): AccountVm {
    const vm = new AccountVm();
    vm.id = entity.id;
    vm.code = entity.code;
    vm.name = entity.name;
    vm.parentId = entity.parentId;
    vm.level = entity.level;
    vm.accountType = entity.accountType;
    vm.nature = entity.nature;
    vm.isDetail = entity.isDetail;
    vm.isActive = entity.isActive;
    vm.description = entity.description;
    vm.createdAt = entity.createdAt?.toISOString() ?? '';
    vm.updatedAt = entity.updatedAt?.toISOString() ?? '';
    return vm;
  }
}
