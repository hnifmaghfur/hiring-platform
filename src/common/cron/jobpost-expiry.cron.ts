import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { JobPost } from 'src/models/job-post/entities/job-post.entity';
import { Repository, LessThan } from 'typeorm';

@Injectable()
export class JobPostExpiryCron {
  private readonly logger = new Logger(JobPostExpiryCron.name);

  constructor(
    @InjectRepository(JobPost)
    private jobPostRepository: Repository<JobPost>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleJobPostExpiry() {
    const now = new Date();
    const expiredPosts = await this.jobPostRepository.find({
      where: {
        expired: false,
        status: 'active',
        expiredDate: LessThan(now),
      },
    });
    if (expiredPosts.length > 0) {
      for (const post of expiredPosts) {
        post.expired = true;
        post.status = 'nonactive';
        await this.jobPostRepository.save(post);
        this.logger.log(`JobPost ${post.id} marked as expired.`);
      }
    }
  }
}
