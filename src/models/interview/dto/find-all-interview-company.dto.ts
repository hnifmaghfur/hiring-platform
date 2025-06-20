import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindAllInterviewDto {
  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    type: Number,
    default: 1,
  })
  @IsString()
  page?: string;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    type: Number,
    default: 10,
    maximum: 100,
  })
  @IsString()
  limit?: string;

  @ApiPropertyOptional({
    description: 'Filter by job post ID',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
