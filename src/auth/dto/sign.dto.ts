import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'Email of the user',
  })
  @IsString()
  email: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'Password of the user',
  })
  @IsString()
  password: string;
}
