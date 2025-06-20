import { IsString, IsDateString } from 'class-validator';

export class CreateInterviewDto {
  @IsString()
  application_id: string;

  @IsDateString()
  date: string;

  @IsString()
  time: string;

  @IsString()
  location: string;
}
