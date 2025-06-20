import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicationModule } from './application/application.module';
import { AuthModule } from './auth/auth.module';
import { CandidateModule } from './candidate/candidate.module';
import { CompanyModule } from './company/company.module';
import { InterviewModule } from './interview/interview.module';
import { NotificationModule } from './notification/notification.module';
import { JobPostModule } from './job-post/job-post.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from './constants';

@Module({
  imports: [
    // Config Module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // TypeORM Module
    TypeOrmModule.forRoot(getTypeOrmConfig()),

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
  providers: [AppService],
})
export class AppModule {}
