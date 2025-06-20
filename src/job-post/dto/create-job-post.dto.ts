import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJobPostDto {
  @ApiProperty({
    type: 'string',
    example: 'Senior Software Engineer',
    description: 'Title of the job post',
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: 'string',
    example: 'Description of the job post',
    description: 'Description of the job post',
  })
  @IsString()
  description: string;

  @ApiProperty({
    type: 'string',
    example: 'Backend, NodeJS, ExpressJS',
    description: 'Skill of the job post',
  })
  @IsString()
  skill: string;

  @ApiProperty({
    type: 'string',
    example: 'Jakarta',
    description: 'Location of the job post',
  })
  @IsString()
  location: string;

  @ApiProperty({
    type: 'number',
    example: 100000,
    description: 'Salary of the job post',
  })
  @IsNumber()
  @IsOptional()
  salary?: number;

  @ApiProperty({
    type: 'string',
    example: 'UUID',
    description: 'Company ID of the job post',
  })
  @IsOptional()
  @IsString()
  company_id?: string;
}
