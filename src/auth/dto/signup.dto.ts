import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SignupDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'Unique email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'Password for the account',
  })
  @IsString()
  password: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'Confirmation of the password (must match password)',
  })
  @IsString()
  confirmPassword: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  @IsString()
  fullName: string;
}
