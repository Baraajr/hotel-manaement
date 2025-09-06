// import { Type } from 'class-transformer';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateCustomerProfileDto {
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  idPassport?: string;

  @IsOptional()
  @IsString()
  address?: string;
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  // @IsString()
  // fullName: string;

  // @IsOptional()
  // @IsString()
  // phone?: string;

  // @IsOptional()
  // @IsString()
  // idPassport?: string;

  // @IsOptional()
  // @IsString()
  // address?: string;

  @IsDefined() // <-- this ensures the property exists
  @ValidateNested()
  @Type(() => CreateCustomerProfileDto)
  customerProfile: CreateCustomerProfileDto;
}
