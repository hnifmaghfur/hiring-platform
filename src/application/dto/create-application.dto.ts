import { IsString, IsOptional } from 'class-validator';

export class CreateApplicationDto {
  @IsOptional()
  @IsString()
  candidate_id: string;

  @IsString()
  job_post_id: string;

  @IsString()
  @IsOptional()
  status?: string; // pending, accepted, rejected
}
