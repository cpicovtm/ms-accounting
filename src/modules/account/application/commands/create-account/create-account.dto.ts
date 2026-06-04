import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { AccountNature } from '../../../domain/enums/account-nature.enum';
import { AccountType } from '../../../domain/enums/account-type.enum';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(20)
  @Matches(/^\d+$/, { message: 'El código debe contener solo dígitos numéricos' })
  code!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(150)
  name!: string;

  @IsString()
  @IsOptional()
  parentId?: string;

  @IsEnum(AccountType, { message: 'Tipo de cuenta inválido. Valores permitidos: ASSET, LIABILITY, EQUITY, INCOME, EXPENSE, CONTINGENT' })
  accountType!: AccountType;

  @IsEnum(AccountNature, { message: 'Naturaleza inválida. Valores permitidos: DEBIT, CREDIT' })
  nature!: AccountNature;

  @IsBoolean()
  isDetail!: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}
