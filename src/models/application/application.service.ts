import { Injectable } from '@nestjs/common';
import { CustomLogger } from '../../common/app-logger';
import { CreateApplicationDto } from './dto/create-application.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Candidate } from 'src/models/candidate/entities/candidate.entity';
import { Repository, DataSource } from 'typeorm';
import { Application } from './entities/application.entity';
import { JobPost } from 'src/models/job-post/entities/job-post.entity';
import { RedisService } from 'src/common/redis.service';
import { Company } from 'src/models/company/entities/company.entity';
import { FindAllApplicationDto } from './dto/find-all-application.dto';
import {
  paginatedErrorResponse,
  paginatedResponse,
  successResponse,
  errorResponse,
} from 'src/common/interfaces/response.interface';
import { PDF_URL } from 'src/constants';
import { Notification } from 'src/models/notification/entities/notification.entity';
import { Interview } from 'src/models/interview/entities/interview.entity';
import { CreateInterviewDto } from 'src/models/interview/dto/create-interview.dto';
import { MailService } from 'src/common/mail/mail.service';
import { interviewNotificationEmailTemplate } from 'src/common/mail/templates/interview-notification.template';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(JobPost)
    private readonly jobPostRepository: Repository<JobPost>,
    private readonly logger: CustomLogger,
    private readonly redisService: RedisService,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly dataSource: DataSource,
    private readonly mailService: MailService,
  ) {}

  async create(createApplicationDto: CreateApplicationDto) {
    const ctx = 'ApplicationService.create';
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      // Verify candidate exists
      const user = await this.candidateRepository.findOne({
        where: { id: createApplicationDto.candidate_id },
      });
      if (!user) {
        throw new Error('User not found');
      }

      // Check job post availability with lock to prevent race conditions
      const jobPost = await queryRunner.manager
        .createQueryBuilder(JobPost, 'jobPost')
        .setLock('pessimistic_write') // Lock the row for update
        .where('jobPost.id = :id', { id: createApplicationDto.job_post_id })
        .andWhere('jobPost.expired = :expired', { expired: false })
        .andWhere('jobPost.max_applications > jobPost.total_applications')
        .getOne();

      if (!jobPost) {
        throw new Error(
          'Job post not found or has reached maximum applications',
        );
      }

      // check application if already applied
      const applicationCheck = await this.applicationRepository.findOne({
        where: {
          job_post_id: createApplicationDto.job_post_id,
          candidate_id: createApplicationDto.candidate_id,
        },
      });
      if (applicationCheck) {
        throw new Error(`Application already exists ${applicationCheck.id}`);
      }

      // Create application
      const application =
        this.applicationRepository.create(createApplicationDto);
      const saved = await queryRunner.manager.save(application);

      // Increment total_applications counter
      await queryRunner.manager
        .createQueryBuilder()
        .update(JobPost)
        .set({
          total_applications: () => 'total_applications + 1',
        })
        .where('id = :id', { id: jobPost.id })
        .execute();

      // insert notification
      const notification = queryRunner.manager.create(Notification, {
        message: 'Your application has been sent',
        candidate_id: application.candidate_id,
        application_id: application.id,
        type: 'application',
      });
      await queryRunner.manager.save(Notification, notification);

      // Commit transaction
      await queryRunner.commitTransaction();
      this.logger.log(`[${ctx}] Application created id: ${saved.id}`);

      return saved;
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `[${ctx}] Error creating application: ${error.message}`,
      );
      throw new Error(error.message);
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

  async findAll(query: FindAllApplicationDto, candidate_id: string) {
    const ctx = 'ApplicationService.findAll';

    try {
      const { page = '1', limit = '10', status } = query;
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      const skip = (pageNum - 1) * limitNum;

      const candidate = await this.candidateRepository.findOne({
        where: { id: candidate_id },
      });
      if (!candidate) {
        throw new Error('User not found');
      }

      const queryBuilder = this.applicationRepository
        .createQueryBuilder('application')
        .leftJoin('application.jobPost', 'jobPost')
        .select([
          'application.id',
          'application.status',
          'application.createdDate',
          'jobPost.id',
          'jobPost.title',
          'jobPost.company_id',
        ])
        .where('application.candidate_id = :candidateId', {
          candidateId: candidate_id,
        });

      // Apply status filter if provided
      if (status) {
        queryBuilder.andWhere('application.status = :status', { status });
      }

      // Get total count for pagination
      const total = await queryBuilder.getCount();

      // Apply pagination
      const applications = await queryBuilder
        .orderBy('application.createdDate', 'DESC', 'NULLS LAST')
        .skip(skip)
        .take(limitNum)
        .getMany();

      const result = {
        data: applications,
        meta: {
          totalItems: total,
          itemCount: applications.length,
          itemsPerPage: limitNum,
          totalPages: Math.ceil(total / limitNum),
          currentPage: pageNum,
        },
      };

      return paginatedResponse(
        result.data,
        result.meta,
        'Applications retrieved successfully',
      );
    } catch (error) {
      this.logger.error(
        `[${ctx}] Error fetching applications: ${error.message}`,
      );
      return paginatedErrorResponse(error.message);
    }
  }

  async findOne(id: string, candidate_id: string) {
    const ctx = 'ApplicationService.findOne';
    try {
      // Verify candidate exists
      const candidate = await this.candidateRepository.findOne({
        where: { id: candidate_id },
      });
      if (!candidate) {
        throw new Error('Candidate not found');
      }

      // Get from redis cache
      const checkCache = await this.redisService.get(`application:${id}`);
      if (checkCache) {
        return successResponse(JSON.parse(checkCache), 'Application found');
      }

      // Get application with all related data (excluding sensitive company fields)
      const application = await this.applicationRepository
        .createQueryBuilder('application')
        // Select all application fields
        .select('application')
        // Join and select all job post fields
        .leftJoinAndSelect('application.jobPost', 'jobPost')
        // Join company relation but don't select any fields yet
        .leftJoin('jobPost.company', 'company')
        // Explicitly select all company fields except password
        .addSelect([
          'company.id',
          'company.name',
          'company.email',
          'company.phone',
          'company.address',
        ])
        .where('application.id = :id', { id })
        .andWhere('application.candidate_id = :candidateId', {
          candidateId: candidate_id,
        })
        .getOne();

      if (!application) {
        throw new Error('Application not found');
      }

      // Set to redis cache
      await this.redisService.set(
        `application:${id}`,
        JSON.stringify(application),
        7200,
      );

      return successResponse(application, 'Application found');
    } catch (error) {
      this.logger.error(
        `[${ctx}] Error fetching application: ${error.message}`,
      );
      return errorResponse(error.message);
    }
  }

  async findAllByCompany(
    id: string,
    company_id: string,
    query: FindAllApplicationDto,
  ) {
    const ctx = 'ApplicationService.findAllByCompany';
    try {
      const { page = '1', limit = '10', search } = query;
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      const skip = (pageNum - 1) * limitNum;

      const company = await this.companyRepository.findOne({
        where: { id: company_id },
      });
      if (!company) {
        throw new Error('Company not found');
      }

      const jobPost = await this.jobPostRepository.findOne({
        where: { id },
      });
      if (!jobPost) {
        throw new Error('Job post not found');
      }

      const queryBuilder = this.applicationRepository
        .createQueryBuilder('application')
        .leftJoin('application.jobPost', 'jobPost')
        .leftJoin('jobPost.company', 'company')
        .leftJoin('application.candidate', 'candidate')
        .select([
          'jobPost.id',
          'candidate.id',
          'company.id',
          'application.id',
          'jobPost.title',
          'candidate.name',
          'candidate.email',
          'candidate.phone',
          'candidate.skill',
          'candidate.resume',
          'application.status',
          'application.createdDate',
        ])
        .where('company.id = :company_id', { company_id })
        .andWhere('jobPost.id = :id', { id });

      if (search) {
        queryBuilder.andWhere('candidate.name ILIKE :search', {
          search: `%${search}%`,
        });
      }

      // Apply pagination and ordering
      const applications = await queryBuilder
        .orderBy('application.createdDate', 'DESC')
        .addOrderBy('candidate.name', 'ASC')
        .skip(skip)
        .take(limitNum)
        .getMany();

      // Add resumeUrl to each candidate
      const baseResumeUrl = PDF_URL;
      const applicationsWithResumeUrl = applications.map((app) => {
        if (app.candidate) {
          return {
            ...app,
            candidate: {
              ...app.candidate,
              resumeUrl: app.candidate.resume
                ? baseResumeUrl + app.candidate.resume
                : null,
            },
          };
        }
        return app;
      });

      const result = {
        data: applicationsWithResumeUrl,
        meta: {
          totalItems: applicationsWithResumeUrl.length,
          itemCount: applicationsWithResumeUrl.length,
          itemsPerPage: limitNum,
          totalPages: Math.ceil(applicationsWithResumeUrl.length / limitNum),
          currentPage: pageNum,
        },
      };

      return paginatedResponse(
        result.data,
        result.meta,
        'Applications retrieved successfully',
      );
    } catch (error) {
      this.logger.error(
        `[${ctx}] Error fetching applications: ${error.message}`,
      );
      return errorResponse(error.message);
    }
  }

  async interview(
    id: string,
    company_id: string,
    interview: CreateInterviewDto,
  ) {
    const ctx = 'ApplicationService.interview';
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Find application
      const application = await queryRunner.manager.findOne(Application, {
        where: { id, jobPost: { company: { id: company_id } } },
      });

      if (!application) {
        throw new Error('Application not found');
      }

      // Verify company exists
      const company = await queryRunner.manager.findOne(Company, {
        where: { id: company_id },
      });

      if (!company) {
        throw new Error('Company not found');
      }

      // Update application status
      application.status = 'interview';
      await queryRunner.manager.save(Application, application);

      // Create interview
      const interviewRunner = queryRunner.manager.create(Interview, {
        application_id: id,
        company_id: company_id,
        candidate_id: application.candidate_id,
        date: interview.date,
        time: interview.time,
        link: interview.link,
        notes: interview.notes,
      });
      await queryRunner.manager.save(Interview, interviewRunner);

      // Create notification
      const notification = queryRunner.manager.create(Notification, {
        message: 'Your application has been approved for an interview',
        candidate_id: application.candidate_id,
        application_id: application.id,
        type: 'interview',
      });

      // send email nodemailer
      const email = application.candidate.email;
      const subject = 'Interview Notification';
      const { text, html } = interviewNotificationEmailTemplate({
        candidateName: application.candidate.name,
        date: interview.date,
        time: interview.time,
        link: interview.link,
      });
      await this.mailService.sendMail(email, subject, text, html);

      await queryRunner.manager.save(Notification, notification);
      await queryRunner.commitTransaction();

      this.logger.log(
        `[${ctx}] Application interviewed id: ${application.id}, candidate: ${application.candidate_id}`,
      );

      return successResponse(
        application.jobPost,
        'Application status updated to interview',
      );
    } catch (error) {
      // Rollback the transaction on error
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
      this.logger.error(
        `[${ctx}] Error processing application interview: ${error.message}`,
      );
      return errorResponse(error.message);
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }
}
