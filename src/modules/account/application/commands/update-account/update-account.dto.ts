import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { AccountNature } from '../../../domain/enums/account-nature.enum';
import { AccountType } from '../../../domain/enums/account-type.enum';

export class UpdateAccountDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(150)
  name!: string;

  @IsEnum(AccountType, { message: 'Tipo de cuenta inválido' })
  @IsOptional()
  accountType?: AccountType;

  @IsEnum(AccountNature, { message: 'Naturaleza inválida' })
  @IsOptional()
  nature?: AccountNature;

  @IsBoolean()
  @IsOptional()
  isDetail?: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  /** UUID del padre al que se quiere reasignar la cuenta, o null para hacerla raíz. */
  @IsUUID()
  @IsOptional()
  parentId?: string | null;
}
