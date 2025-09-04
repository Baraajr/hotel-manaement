import { IsString } from 'class-validator';

export class SignupDto {
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  confirmPassword: string;

  @IsString()
  fullName: string;
}
