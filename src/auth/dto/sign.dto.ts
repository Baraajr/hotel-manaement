import { IsString } from 'class-validator';

export class SignDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
