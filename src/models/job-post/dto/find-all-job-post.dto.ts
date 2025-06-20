import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, IsIn } from 'class-validator';

export class FindAllJobPostDto {
  @ApiPropertyOptional({
    description: 'Filter by location (remote/onsite)',
    enum: ['remote', 'onsite'],
  })
  @IsOptional()
  @IsIn(['remote', 'onsite'])
  location?: 'remote' | 'onsite';

  @ApiPropertyOptional({
    description: 'Search in title or description',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Minimum salary',
    type: String,
  })
  @IsOptional()
  @IsString()
  minSalary?: string;

  @ApiPropertyOptional({
    description: 'Maximum salary',
    type: String,
  })
  @IsOptional()
  @IsString()
  maxSalary?: string;

  @ApiPropertyOptional({
    description: 'Filter by company ID',
  })
  @IsOptional()
  @IsString()
  companyId?: string;

  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    type: String,
    default: 1,
  })
  @IsString()
  page?: string;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    type: String,
    default: 10,
    maximum: 100,
  })
  @IsString()
  limit?: string;
}
