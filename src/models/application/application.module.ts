import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/models/company/entities/company.entity';
import { Candidate } from 'src/models/candidate/entities/candidate.entity';
import { JobPost } from 'src/models/job-post/entities/job-post.entity';
import { Application } from './entities/application.entity';
import { CustomLogger } from '../../common/app-logger';
import { RedisService } from 'src/common/redis.service';
import { Notification } from 'src/models/notification/entities/notification.entity';
import { Interview } from 'src/models/interview/entities/interview.entity';
import { MailModule } from 'src/common/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Company,
      Candidate,
      JobPost,
      Application,
      Notification,
      Interview,
    ]),
    MailModule,
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService, CustomLogger, RedisService],
})
export class ApplicationModule {}
