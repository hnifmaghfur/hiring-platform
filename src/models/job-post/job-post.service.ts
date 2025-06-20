import { Injectable } from '@nestjs/common';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { FindAllJobPostDto } from './dto/find-all-job-post.dto';
import { Company } from '../company/entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobPost } from './entities/job-post.entity';
import { CustomLogger } from '../../common/app-logger';
import { RedisService } from '../../common/redis.service';
import {
  createdResponse,
  notFoundResponse,
  paginatedErrorResponse,
  paginatedResponse,
  successResponse,
} from '../../common/interfaces/response.interface';

export interface JobPostListItem {
  id: string;
  title: string;
  company_id: string;
  company_name: string;
}

@Injectable()
export class JobPostService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(JobPost)
    private readonly jobPostRepository: Repository<JobPost>,
    private readonly logger: CustomLogger = new CustomLogger(),
    private readonly redisService: RedisService,
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

      const jobPost = new JobPost();
      Object.assign(jobPost, createJobPostDto);
      jobPost.status = 'active';
      jobPost.total_applications = 0;
      // Set expiredDate to end of day (23:59:59.999) for the input date or default to 30 days from now
      const inputDate = new Date(createJobPostDto.expiredDate);
      inputDate.setHours(23, 59, 59, 999);
      jobPost.expiredDate = inputDate;

      const saved = await this.jobPostRepository.save(jobPost);
      this.logger.log(`[${ctx}] Job post created id: ${saved.id}`);
      return createdResponse(saved, 'Job post created successfully');
    } catch (error) {
      this.logger.error(`[${ctx}] Error creating job post: ${error.message}`);
      throw error;
    }
  }

  async findAll(query: FindAllJobPostDto) {
    try {
      const { location, search, minSalary, maxSalary, companyId, page, limit } =
        query;

      const pageNum = Number(page);
      const limitNum = Number(limit);
      const minSalaryNum = Number(minSalary);
      const maxSalaryNum = Number(maxSalary);

      if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
        throw new Error('page and limit must be numbers and greater than 0');
      }

      const skip = (pageNum - 1) * limitNum;

      const queryBuilder = this.jobPostRepository
        .createQueryBuilder('jobPost')
        .leftJoinAndSelect('jobPost.company', 'company');

      if (location) {
        queryBuilder.andWhere('jobPost.location = :location', { location });
      }

      if (search) {
        queryBuilder.andWhere(
          '(jobPost.title ILIKE :search OR jobPost.description ILIKE :search OR jobPost.skill ILIKE :search)',
          { search: `%${search}%` },
        );
      }

      if (minSalary !== undefined) {
        queryBuilder.andWhere('jobPost.salary >= :minSalary', {
          minSalary: minSalaryNum,
        });
      }

      if (maxSalary !== undefined) {
        queryBuilder.andWhere('jobPost.salary <= :maxSalary', {
          maxSalary: maxSalaryNum,
        });
      }

      if (companyId) {
        queryBuilder.andWhere('jobPost.company_id = :companyId', { companyId });
      }

      // Only show active and non-expired job posts
      queryBuilder
        .andWhere('jobPost.status = :status', { status: 'active' })
        .andWhere(
          '(jobPost.expired = :expired AND jobPost.expiredDate > CURRENT_TIMESTAMP)',
          {
            expired: false,
          },
        );

      // Order by most recent first
      queryBuilder.orderBy('jobPost.createdDate', 'DESC');

      // Get total count for pagination
      const total = await queryBuilder.getCount();

      // Apply pagination
      queryBuilder.skip(skip).take(limitNum);

      type QueryResult = {
        id: string;
        title: string;
        company_id: string;
        company_name: string;
      };

      const items = await queryBuilder
        .select([
          'jobPost.id as id',
          'jobPost.title as title',
          'company.id as company_id',
          'company.name as company_name',
        ])
        .getRawMany<QueryResult>()
        .then((results) => results);

      const meta = {
        totalItems: total,
        itemCount: items.length,
        itemsPerPage: limitNum,
        totalPages: Math.ceil(total / limitNum),
        currentPage: pageNum,
      };

      return paginatedResponse(items, meta, 'Job posts found');
    } catch (error) {
      return paginatedErrorResponse(error.message);
    }
  }

  async getOnePost(id: string) {
    return await this.jobPostRepository
      .createQueryBuilder('jobPost')
      .leftJoinAndSelect('jobPost.company', 'company')
      .where('jobPost.id = :id', { id })
      .select([
        'jobPost.id',
        'jobPost.title',
        'jobPost.skill',
        'jobPost.description',
        'jobPost.location',
        'jobPost.salary',
        'jobPost.status',
        'jobPost.expiredDate',
        'jobPost.expired',
        'jobPost.company_id',
        'jobPost.total_applications',
        'jobPost.max_applications',
        'company.id',
        'company.name',
        'company.address',
        'company.email',
        'company.phone',
      ])
      .getOne();
  }

  async findOne(id: string) {
    // Check if job post is cached
    const cachedJobPost = await this.redisService.get(`job-post:${id}`);
    if (cachedJobPost) {
      return successResponse(JSON.parse(cachedJobPost), 'Job post found');
    }

    const jobPost = await this.getOnePost(id);
    if (!jobPost) {
      return notFoundResponse('Job post not found');
    }

    // Set cache for 1 hour
    await this.redisService.set(
      `job-post:${id}`,
      JSON.stringify(jobPost),
      3600,
    );

    this.logger.log(
      `[RedisCache-JobPost] Job post with id: ${id} cache updated successfully`,
    );
    return successResponse(jobPost, 'Job post found');
  }

  async update(id: string, updateJobPostDto: UpdateJobPostDto) {
    const ctx = 'JobPostService.update';
    try {
      this.logger.log(`[${ctx}] Updating job post with id: ${id}`);

      const jobPost = await this.jobPostRepository.findOne({ where: { id } });
      if (!jobPost) {
        const errorMsg = `Job post with id ${id} not found`;
        throw new Error(errorMsg);
      }

      if (updateJobPostDto.max_applications) {
        if (updateJobPostDto.max_applications < jobPost.total_applications) {
          const errorMsg = `Max applications cannot be less than total applications`;
          throw new Error(errorMsg);
        }
      }

      if (jobPost.expired) {
        const errorMsg = `Job post with id ${id} is expired`;
        throw new Error(errorMsg);
      }

      if (
        updateJobPostDto.expiredDate &&
        new Date(
          updateJobPostDto.expiredDate + 'T00:00:00.000Z',
        ).toISOString() < new Date().toISOString()
      ) {
        const errorMsg = `Expired date cannot be less than current date`;
        throw new Error(errorMsg);
      }

      const company = await this.companyRepository.findOne({
        where: { id: updateJobPostDto.company_id },
      });
      if (!company) {
        const errorMsg = `Company with id ${updateJobPostDto.company_id} not found`;
        throw new Error(errorMsg);
      }

      if (updateJobPostDto.expiredDate) {
        const inputDate = new Date(updateJobPostDto.expiredDate);
        inputDate.setHours(23, 59, 59, 999);
        updateJobPostDto.expiredDate = inputDate.toISOString();
      }

      const result = await this.jobPostRepository.update(id, updateJobPostDto);
      if (result.affected === 0) {
        throw new Error('Job post not found');
      }

      // update cache
      const checkCache = await this.redisService.get(`job-post:${id}`);
      if (checkCache) {
        const newData = await this.getOnePost(id);
        if (newData) {
          await this.redisService.del(`job-post:${id}`);
          await this.redisService.set(
            `job-post:${id}`,
            JSON.stringify(newData),
            3600,
          );
          this.logger.log(
            `[RedisCache-JobPost] Job post with id: ${id} cache updated successfully`,
          );
        }
      }

      this.logger.log(`[${ctx}] Successfully updated job post with id: ${id}`);
      return createdResponse({ id }, 'Job post updated successfully');
    } catch (error) {
      this.logger.error(
        `[${ctx}] Error updating job post: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: string) {
    const ctx = 'JobPostService.remove';
    try {
      this.logger.log(`[${ctx}] Soft deleting job post with id: ${id}`);

      const jobPost = await this.jobPostRepository.findOne({ where: { id } });
      if (!jobPost) {
        const errorMsg = `Job post with id ${id} not found`;
        throw new Error(errorMsg);
      }

      // Use softRemove instead of delete for soft deletion
      await this.jobPostRepository.softRemove(jobPost);
      this.logger.log(
        `[${ctx}] Successfully soft deleted job post with id: ${id}`,
      );

      // delete cache
      await this.redisService.del(`job-post:${id}`);
      this.logger.log(
        `[RedisCache-JobPost] Job post with id: ${id} cache deleted successfully`,
      );

      return createdResponse({ id }, 'Job post deleted successfully');
    } catch (error) {
      this.logger.error(
        `[${ctx}] Error soft deleting job post: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
