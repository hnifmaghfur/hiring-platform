import { PartialType } from '@nestjs/mapped-types';
import { IsIn, IsNumber, IsOptional } from 'class-validator';
import { CreateJobPostDto } from './create-job-post.dto';

export class UpdateJobPostDto extends PartialType(CreateJobPostDto) {
  @IsOptional()
  @IsIn(['active', 'nonactive'], {
    message: 'Status must be either active or nonactive',
  })
  status?: 'active' | 'nonactive';

  @IsOptional()
  @IsNumber()
  max_applications?: number;
}
