import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  message: string;

  @IsString()
  candidate_id: string;

  @IsString()
  type: string; // interview, job offer, rejection

  @IsDateString()
  @IsOptional()
  date_sent?: Date;
}
