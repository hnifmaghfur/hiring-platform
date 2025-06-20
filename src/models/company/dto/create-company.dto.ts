import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'Name of the company',
    type: 'string',
    example: 'Company Name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Address of the company',
    type: 'string',
    example: 'Company Address',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Email of the company',
    type: 'string',
    example: 'company@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password of the company',
    type: 'string',
    example: 'password',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Phone number of the company',
    type: 'string',
    example: '08123456789',
  })
  @IsString()
  phone: string;
}
