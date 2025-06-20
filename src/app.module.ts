import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicationModule } from './models/application/application.module';
import { AuthModule } from './models/auth/auth.module';
import { CandidateModule } from './models/candidate/candidate.module';
import { CompanyModule } from './models/company/company.module';
import { InterviewModule } from './models/interview/interview.module';
import { NotificationModule } from './models/notification/notification.module';
import { JobPostModule } from './models/job-post/job-post.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from './constants';
import { ScheduleModule } from '@nestjs/schedule';
import { JobPost } from './models/job-post/entities/job-post.entity';
import { JobPostExpiryCron } from './common/cron/jobpost-expiry.cron';

@Module({
  imports: [
    // Config Module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // TypeORM Module
    TypeOrmModule.forRoot(getTypeOrmConfig()),

    // Schedule Module for cron jobs
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([JobPost]),

    // Modules
    ApplicationModule,
    AuthModule,
    CandidateModule,
    CompanyModule,
    InterviewModule,
    NotificationModule,
    JobPostModule,
  ],
  controllers: [AppController],
  providers: [AppService, JobPostExpiryCron],
})
export class AppModule {}
