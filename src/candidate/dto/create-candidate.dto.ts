import { IsString, IsEmail, IsOptional } from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCandidateDto {
  @ApiPropertyOptional({ description: 'UUID of the candidate' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ description: 'Full name of the candidate' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Email address of the candidate' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password (will be hashed)' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'Skill of the candidate' })
  @IsString()
  skill: string;

  @ApiProperty({ description: 'Phone number' })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Resume or link to resume file' })
  @IsOptional()
  @IsString()
  resume?: string;
}
