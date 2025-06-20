import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../common/jwt/jwt-auth.guard';
import { JobPostService } from './job-post.service';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { GlobalValidationPipe } from '../../common/validate.pipe';
import { createdResponse } from '../../common/global.schema';
import { BadRequestResponse } from '../../common/global.schema';
import { InternalServerErrorResponse } from '../../common/global.schema';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JobPostRegisterApiResponse } from './schema/job-post-swagger.schema';
import { getRoleId, TYPE_ACCOUNT } from 'src/constants';
import { FindAllJobPostDto } from './dto/find-all-job-post.dto';

@Controller('job-post')
export class JobPostController {
  constructor(private readonly jobPostService: JobPostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a job post' })
  @ApiConsumes('application/json')
  @ApiBearerAuth('JWT')
  @ApiBody({ type: CreateJobPostDto })
  @ApiResponse(
    createdResponse(
      JobPostRegisterApiResponse.description,
      JobPostRegisterApiResponse.schema,
    ),
  )
  @ApiResponse(BadRequestResponse('Bad request'))
  @ApiResponse(InternalServerErrorResponse('Internal server error'))
  create(
    @Body(GlobalValidationPipe) createJobPostDto: CreateJobPostDto,
    @Req() req: Request,
  ) {
    if (!req.token) {
      throw new Error('Unauthorized: No user found in request');
    }
    if (req.token.role !== getRoleId(TYPE_ACCOUNT.COMPANY)) {
      throw new Error('Unauthorized: User is not company');
    }
    return this.jobPostService.create({
      ...createJobPostDto,
      company_id: req.token.id,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all job posts with optional filters' })
  @ApiResponse({ status: 200, description: 'List of job posts' })
  async findAll(@Query() query: FindAllJobPostDto) {
    return this.jobPostService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a job post by id' })
  @ApiResponse({ status: 200, description: 'Job post found' })
  @ApiResponse(BadRequestResponse('Bad request'))
  @ApiResponse(InternalServerErrorResponse('Internal server error'))
  async findOne(@Param('id') id: string) {
    return this.jobPostService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update a job post' })
  @ApiConsumes('application/json')
  @ApiBody({ type: UpdateJobPostDto })
  @ApiResponse({ status: 200, description: 'Job post updated successfully' })
  @ApiResponse(BadRequestResponse('Bad request'))
  @ApiResponse(InternalServerErrorResponse('Internal server error'))
  async update(
    @Param('id') id: string,
    @Body() updateJobPostDto: UpdateJobPostDto,
    @Req() req: Request,
  ) {
    if (!req.token) {
      throw new Error('Unauthorized: No user found in request');
    }
    if (req.token.role !== getRoleId(TYPE_ACCOUNT.COMPANY)) {
      throw new Error('Unauthorized: User is not company');
    }
    return this.jobPostService.update(id, {
      ...updateJobPostDto,
      company_id: req.token.id,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Delete a job post' })
  @ApiResponse({ status: 200, description: 'Job post deleted successfully' })
  @ApiResponse(BadRequestResponse('Bad request'))
  @ApiResponse(InternalServerErrorResponse('Internal server error'))
  async remove(@Param('id') id: string, @Req() req: Request) {
    if (!req.token) {
      throw new Error('Unauthorized: No user found in request');
    }
    if (req.token.role !== getRoleId(TYPE_ACCOUNT.COMPANY)) {
      throw new Error('Unauthorized: User is not company');
    }
    return this.jobPostService.remove(id);
  }
}
