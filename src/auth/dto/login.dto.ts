import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@email.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'yourpassword', description: 'User password' })
  @IsString()
  password: string;
}
