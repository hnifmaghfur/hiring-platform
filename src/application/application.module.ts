import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/company/entities/company.entity';
import { Candidate } from 'src/candidate/entities/candidate.entity';
import { JobPost } from 'src/job-post/entities/job-post.entity';
import { Application } from './entities/application.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, Candidate, JobPost, Application]),
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}
