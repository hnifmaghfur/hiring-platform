import { Injectable } from '@nestjs/common';
import { FindAllInterviewDto } from './dto/find-all-interview-company.dto';
import { Logger } from '@nestjs/common';
import {
  errorResponse,
  paginatedErrorResponse,
  paginatedResponse,
} from 'src/common/interfaces/response.interface';
import { Interview } from './entities/interview.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PDF_URL } from 'src/constants';
import { successResponse } from 'src/common/global.schema';
import { RedisService } from 'src/common/redis.service';
import { MailService } from 'src/common/mail/mail.service';
import { Notification } from 'src/models/notification/entities/notification.entity';
import { Application } from 'src/models/application/entities/application.entity';
import { JobPost } from 'src/models/job-post/entities/job-post.entity';
import { Candidate } from 'src/models/candidate/entities/candidate.entity';
import { interviewResultEmailTemplate } from 'src/common/mail/templates/interview-result.template';

@Injectable()
export class InterviewService {
  private readonly logger = new Logger(InterviewService.name);

  constructor(
    @InjectRepository(Interview)
    private interviewRepository: Repository<Interview>,
    private readonly redisService: RedisService,
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @InjectRepository(JobPost)
    private jobPostRepository: Repository<JobPost>,
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private readonly mailService: MailService,
  ) {}

  async findAll(query: FindAllInterviewDto, companyId: string) {
    const ctx = 'InterviewService.findAll';
    try {
      const { page = '1', limit = '10', search } = query;
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      const skip = (pageNum - 1) * limitNum;

      const queryBuilder = this.interviewRepository
        .createQueryBuilder('interview')
        .leftJoin('interview.application', 'application')
        .leftJoin('application.jobPost', 'jobPost')
        .leftJoin('interview.candidate', 'candidate')
        .addSelect([
          'candidate.id',
          'candidate.name',
          'application.id',
          'jobPost.id',
        ])
        .where('interview.company_id = :companyId', { companyId })
        .andWhere('interview.result = :result', { result: false })
        .take(limitNum)
        .skip(skip);

      if (search) {
        queryBuilder.andWhere('candidate.name ILIKE :search', {
          search: `%${search}%`,
        });
      }

      const [interviews, count] = await queryBuilder.getManyAndCount();
      const totalPages = Math.ceil(count / limitNum);

      return paginatedResponse(
        interviews,
        {
          totalItems: count,
          itemCount: interviews.length,
          itemsPerPage: limitNum,
          totalPages,
          currentPage: pageNum,
        },
        'Interviews retrieved successfully',
      );
    } catch (error) {
      this.logger.error(`[${ctx}] Error fetching interviews: ${error.message}`);
      return paginatedErrorResponse(error.message);
    }
  }

  async findAllByCandidate(query: FindAllInterviewDto, candidateId: string) {
    const ctx = 'InterviewService.findAllByCandidate';
    try {
      const { page = '1', limit = '10', search } = query;
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      const skip = (pageNum - 1) * limitNum;

      const queryBuilder = this.interviewRepository
        .createQueryBuilder('interview')
        .leftJoin('interview.company', 'company')
        .addSelect(['company.id', 'company.name'])
        .where('interview.candidate_id = :candidateId', { candidateId })
        .andWhere('interview.result = :result', { result: false })
        .take(limitNum)
        .skip(skip);

      if (search) {
        queryBuilder.andWhere('company.name ILIKE :search', {
          search: `%${search}%`,
        });
      }

      const [interviews, count] = await queryBuilder.getManyAndCount();
      const totalPages = Math.ceil(count / limitNum);
      return paginatedResponse(
        interviews,
        {
          totalItems: count,
          itemCount: interviews.length,
          itemsPerPage: limitNum,
          totalPages,
          currentPage: pageNum,
        },
        'Interviews retrieved successfully',
      );
    } catch (error) {
      this.logger.error(`[${ctx}] Error fetching interviews: ${error.message}`);
      return paginatedErrorResponse(error.message);
    }
  }

  async findOne(id: string, companyId: string) {
    const ctx = 'InterviewService.findOne';
    try {
      const redisInterview = await this.redisService.get(`interview:${id}`);
      if (redisInterview) {
        this.logger.log(`[${ctx}] Interview ${id} found in cache`);
        return successResponse(
          'Interview retrieved successfully',
          JSON.parse(redisInterview),
        );
      }

      const interview = await this.interviewRepository
        .createQueryBuilder('interview')
        .leftJoin('interview.candidate', 'candidate')
        .leftJoin('interview.application', 'application')
        .leftJoin('application.jobPost', 'jobPost')
        .addSelect([
          'application.id',
          'jobPost',
          'candidate.id',
          'candidate.name',
          'candidate.email',
          'candidate.phone',
          'candidate.skill',
          'candidate.resume',
        ])
        .where('interview.company_id = :companyId', { companyId })
        .andWhere('interview.result = :result', { result: false })
        .andWhere('interview.id = :id', { id })
        .getOne();

      if (!interview) {
        throw new Error('Interview not found');
      }

      const baseResumeUrl = PDF_URL;
      let candidate = interview.candidate;
      if (candidate && candidate.resume) {
        candidate = {
          ...candidate,
          resume: `${baseResumeUrl}${candidate.resume}`,
        };
      }
      interview.candidate = candidate;

      // add caching with redis
      const redis = await this.redisService.set(
        `interview:${id}`,
        JSON.stringify(interview),
        3600,
      );
      if (redis) {
        this.logger.log(`[${ctx}] Interview ${id} cached successfully`);
      }
      return successResponse('Interview retrieved successfully', interview);
    } catch (error) {
      this.logger.error(`[${ctx}] Error fetching interview: ${error.message}`);
      return errorResponse(error.message);
    }
  }

  async findOneByCandidate(id: string, candidateId: string) {
    const ctx = 'InterviewService.findOneByCandidate';
    try {
      const interview = await this.interviewRepository
        .createQueryBuilder('interview')
        .leftJoin('interview.company', 'company')
        .leftJoin('interview.application', 'application')
        .leftJoin('application.jobPost', 'jobPost')
        .addSelect([
          'company.id',
          'company.name',
          'company.email',
          'company.phone',
          'company.address',
          'application.id',
          'application.status',
          'jobPost.id',
          'jobPost.title',
          'jobPost.description',
          'jobPost.location',
        ])
        .where('interview.candidate_id = :candidateId', { candidateId })
        .andWhere('interview.id = :id', { id })
        .andWhere('interview.result = :result', { result: false })
        .getOne();

      if (!interview) {
        throw new Error('Interview not found');
      }

      // Exclude candidate from response
      const { candidate, ...rest } = interview;

      return successResponse('Interview retrieved successfully', rest);
    } catch (error) {
      this.logger.error(`[${ctx}] Error fetching interview: ${error.message}`);
      return errorResponse(error.message);
    }
  }

  async updateInterviewResult(id: string, companyId: string, result: boolean) {
    const ctx = 'InterviewService.updateInterview';
    const queryRunner =
      this.interviewRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Find the interview and related entities
      const interview = await queryRunner.manager.findOne(Interview, {
        where: { id, company_id: companyId },
      });
      if (!interview) throw new Error('Interview not found');

      // Update application status
      const application = await queryRunner.manager.findOne(Application, {
        where: { id: interview.application_id },
      });
      if (!application) throw new Error('Application not found');

      application.status = result ? 'accepted' : 'rejected';
      await queryRunner.manager.save(application);

      // Update job post status if result is true
      if (result) {
        const jobPost = await queryRunner.manager.findOne(JobPost, {
          where: { id: application.job_post_id },
        });
        if (jobPost) {
          jobPost.status = 'nonactive';
          await queryRunner.manager.save(jobPost);
        }
      }

      // Send notification and email
      const candidate = await queryRunner.manager.findOne(Candidate, {
        where: { id: interview.candidate_id },
      });
      if (candidate) {
        // Notification
        const notification = this.notificationRepository.create({
          message: result
            ? 'Congratulations! You have passed the interview.'
            : 'Thank you for your time. Unfortunately, you did not pass the interview.',
          candidate_id: candidate.id,
          application_id: application.id,
          type: 'interview_result',
        });
        await queryRunner.manager.save(notification);

        // Email
        const { text, html } = interviewResultEmailTemplate({
          candidateName: candidate.name,
          result: result ? 'success' : 'failed',
          notes: notification.message,
        });
        await this.mailService.sendMail(
          candidate.email,
          'Interview Result',
          text,
          html,
        );
      }

      if (!candidate) {
        throw new Error('Candidate not found');
      }

      await queryRunner.commitTransaction();
      if (result) {
        this.logger.log(
          `[${ctx}] Candidate ${candidate.name} passed interview with application ${application.id}`,
        );
      }
      return successResponse(
        'Interview result and related data updated successfully',
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`[${ctx}] Transaction failed: ${error.message}`);
      return errorResponse(error.message);
    } finally {
      await queryRunner.release();
    }
  }
}
