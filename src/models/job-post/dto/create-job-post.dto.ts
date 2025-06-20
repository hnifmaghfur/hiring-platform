import { IsString, IsNumber, IsOptional, IsIn, IsDate } from 'class-validator';
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
    enum: ['remote', 'onsite'],
    example: 'onsite',
    description: 'Location type of the job post (remote or onsite)',
  })
  @IsString()
  @IsIn(['remote', 'onsite'], {
    message: 'Location must be either remote or onsite',
  })
  location: 'remote' | 'onsite';

  @ApiProperty({
    type: 'number',
    example: 100000,
    description: 'Salary of the job post',
  })
  @IsNumber()
  @IsOptional()
  salary?: number;

  @ApiProperty({
    type: 'number',
    example: 10,
    description: 'Max limit of application',
  })
  @IsNumber()
  @IsOptional()
  max_applications?: number;

  @ApiProperty({
    type: 'string',
    example: 'UUID',
    description: 'Company ID of the job post',
  })
  @IsOptional()
  @IsString()
  company_id?: string;

  @ApiProperty({
    type: 'string',
    example: '2025-06-20',
    description: 'Expired date of the job post',
  })
  @IsString()
  expiredDate: string;
}
