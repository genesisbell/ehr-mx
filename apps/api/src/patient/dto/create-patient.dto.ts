import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  Length,
  Matches,
  IsIn,
  IsDateString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { CURP_REGEX } from '@ehr-mx/shared';

export class CreatePatientDto {
  @IsString()
  @Length(18, 18)
  @Transform(({ value }) => (typeof value === 'string' ? value.toUpperCase() : value))
  @Matches(CURP_REGEX, { message: 'Invalid CURP format' })
  curp!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  paternalSurname!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  maternalSurname?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(15)
  phone?: string;

  @IsDateString()
  birthDate!: string;

  @IsIn(['M', 'F'])
  sex!: string;
}
