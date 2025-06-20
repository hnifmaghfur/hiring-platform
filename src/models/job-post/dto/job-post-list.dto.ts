import { ApiProperty } from '@nestjs/swagger';

export class CompanyDto {
  @ApiProperty({ description: 'Company ID' })
  id: string;

  @ApiProperty({ description: 'Company name' })
  name: string;

  @ApiProperty({ description: 'Company logo URL', required: false })
  logo?: string;
}

export class JobPostListDto {
  @ApiProperty({ description: 'Job post ID' })
  id: string;

  @ApiProperty({ description: 'Job title' })
  title: string;

  @ApiProperty({ description: 'Company details' })
  company: CompanyDto;
}
