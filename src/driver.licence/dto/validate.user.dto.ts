import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { State } from '@driver.licence/enum/state.enum';

export class ValidateUserDto {
  @IsNotEmpty()
  birthDate: Date;

  @IsString()
  @MaxLength(100)
  firstName: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  middleName?: string;

  @IsString()
  @MaxLength(100)
  lastName: string;

  @IsString()
  licenceNumber: string;

  @IsEnum(State)
  state: State;

  @IsOptional()
  expiryDate?: Date;
}
