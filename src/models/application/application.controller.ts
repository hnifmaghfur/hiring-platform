import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { ApplicationService } from './application.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/jwt/jwt-auth.guard';
import { getRoleId, TYPE_ACCOUNT } from 'src/constants';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { FindAllApplicationDto } from './dto/find-all-application.dto';
import { CreateInterviewDto } from 'src/models/interview/dto/create-interview.dto';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post(':job_post_id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Apply for a job post' })
  @ApiParam({ name: 'job_post_id', required: true })
  @ApiResponse({ status: 201, description: 'Application created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async create(@Param('job_post_id') job_post_id: string, @Req() req: Request) {
    if (!req.token) {
      throw new Error('Unauthorized: No user found in request');
    }
    if (req.token.role !== getRoleId(TYPE_ACCOUNT.CANDIDATE)) {
      throw new Error('Unauthorized: User is not candidate');
    }
    return await this.applicationService.create({
      job_post_id,
      candidate_id: req.token.id,
    });
  }

  @Get('candidate')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all applications' })
  @ApiResponse({ status: 200, description: 'Applications found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findAll(@Query() query: FindAllApplicationDto, @Req() req: Request) {
    if (!req.token) {
      throw new Error('Unauthorized: No user found in request');
    }
    if (req.token.role !== getRoleId(TYPE_ACCOUNT.CANDIDATE)) {
      throw new Error('Unauthorized: User is not candidate');
    }
    return this.applicationService.findAll(query, req.token.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a single application' })
  @ApiResponse({ status: 200, description: 'Application found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findOne(@Param('id') id: string, @Req() req: Request) {
    if (!req.token) {
      throw new Error('Unauthorized: No user found in request');
    }
    if (req.token.role !== getRoleId(TYPE_ACCOUNT.CANDIDATE)) {
      throw new Error('Unauthorized: User is not candidate');
    }
    return this.applicationService.findOne(id, req.token.id);
  }

  @Get('company/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all applications by company' })
  @ApiResponse({ status: 200, description: 'Applications found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findAllByCompany(
    @Param('id') id: string,
    @Query() query: FindAllApplicationDto,
    @Req() req: Request,
  ) {
    if (!req.token) {
      throw new Error('Unauthorized: No user found in request');
    }
    if (req.token.role !== getRoleId(TYPE_ACCOUNT.COMPANY)) {
      throw new Error('Unauthorized: User is not company');
    }
    return this.applicationService.findAllByCompany(id, req.token.id, query);
  }

  @Post('company/interview/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Interview an application' })
  @ApiResponse({ status: 200, description: 'Application interviewed' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  interview(
    @Param('id') id: string,
    @Body() applicationInterviewDto: CreateInterviewDto,
    @Req() req: Request,
  ) {
    if (!req.token) {
      throw new Error('Unauthorized: No user found in request');
    }
    if (req.token.role !== getRoleId(TYPE_ACCOUNT.COMPANY)) {
      throw new Error('Unauthorized: User is not company');
    }
    return this.applicationService.interview(
      id,
      req.token.id,
      applicationInterviewDto,
    );
  }
}
