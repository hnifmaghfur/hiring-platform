import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInterviewDto {
  @ApiPropertyOptional({
    description: 'ID of the company',
    type: String,
  })
  @IsString()
  company_id: string;

  @ApiPropertyOptional({
    description: 'ID of the job post',
    type: String,
  })
  @IsString()
  job_post_id: string;

  @ApiPropertyOptional({
    description: 'ID of the candidate',
    type: String,
  })
  @IsString()
  candidate_id: string;

  @ApiPropertyOptional({
    description: 'Interview date (YYYY-MM-DD)',
    type: String,
    example: '2025-07-01',
  })
  @IsString()
  date: string;

  @ApiPropertyOptional({
    description: 'Interview time (HH:mm)',
    type: String,
    example: '14:00',
  })
  @IsString()
  time: string;

  @ApiPropertyOptional({
    description: 'Interview link (for online interviews)',
    type: String,
    example: 'https://meet.example.com/abc123',
    required: false,
  })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiPropertyOptional({
    description: 'Additional notes',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
