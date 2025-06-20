import { Module } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { InterviewController } from './interview.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interview } from './entities/interview.entity';
import { Company } from 'src/models/company/entities/company.entity';
import { Application } from 'src/models/application/entities/application.entity';
import { Candidate } from 'src/models/candidate/entities/candidate.entity';
import { JobPost } from 'src/models/job-post/entities/job-post.entity';
import { RedisService } from 'src/common/redis.service';
import { MailService } from 'src/common/mail/mail.service';
import { CustomLogger } from 'src/common/app-logger';
import { MailModule } from 'src/common/mail/mail.module';
import { Notification } from 'src/models/notification/entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Interview,
      Company,
      Application,
      Candidate,
      JobPost,
      Notification,
    ]),
    MailModule,
  ],
  controllers: [InterviewController],
  providers: [InterviewService, CustomLogger, RedisService, MailService],
})
export class InterviewModule {}
