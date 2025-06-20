import { Module } from '@nestjs/common';
import { JobPostService } from './job-post.service';
import { JobPostController } from './job-post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPost } from './entities/job-post.entity';
import { Company } from '../company/entities/company.entity';
import { CustomLogger } from '../../common/app-logger';
import { RedisService } from '../../common/redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([JobPost, Company])],
  controllers: [JobPostController],
  providers: [JobPostService, CustomLogger, RedisService],
})
export class JobPostModule {}
