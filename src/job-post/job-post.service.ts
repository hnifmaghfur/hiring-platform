import { Injectable } from '@nestjs/common';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { Company } from '../company/entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobPost } from './entities/job-post.entity';
import { CustomLogger } from '../common/app-logger';

@Injectable()
export class JobPostService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(JobPost)
    private readonly jobPostRepository: Repository<JobPost>,
    private readonly logger: CustomLogger = new CustomLogger(),
  ) {}

  async create(createJobPostDto: CreateJobPostDto) {
    const ctx = 'JobPostService.create';
    try {
      if (!createJobPostDto.company_id) {
        throw new Error('company_id is required');
      }
      const company = await this.companyRepository.findOne({
        where: { id: createJobPostDto.company_id },
      });
      if (!company) {
        throw new Error('Company not found');
      }
      const jobPost = this.jobPostRepository.create(createJobPostDto);
      const saved = await this.jobPostRepository.save(jobPost);
      this.logger.log(`[${ctx}] Job post created id: ${saved.id}`);
      return saved;
    } catch (error) {
      this.logger.error(`[${ctx}] Error creating job post: ${error.message}`);
      throw error;
    }
  }

  findAll() {
    return `This action returns all jobPost`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jobPost`;
  }

  update(id: number, updateJobPostDto: UpdateJobPostDto) {
    return `This action updates a #${id} jobPost`;
  }

  remove(id: number) {
    return `This action removes a #${id} jobPost`;
  }
}
