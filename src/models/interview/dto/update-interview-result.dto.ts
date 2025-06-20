import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateInterviewResultDto {
  @ApiPropertyOptional({ description: 'Interview result (e.g. passed, failed, pending)' })
  @IsString()
  result: string;

  @ApiPropertyOptional({ description: 'Additional notes about the interview result', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
