import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../common/jwt/jwt-auth.guard';
import { JobPostService } from './job-post.service';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { GlobalValidationPipe } from '../common/validate.pipe';
import { createdResponse } from '../common/global.schema';
import { BadRequestResponse } from '../common/global.schema';
import { InternalServerErrorResponse } from '../common/global.schema';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JobPostRegisterApiResponse } from './schema/job-post-swagger.schema';

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
    return this.jobPostService.create({
      ...createJobPostDto,
      company_id: req.token.id,
    });
  }

  @Get()
  findAll() {
    return this.jobPostService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobPostService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobPostDto: UpdateJobPostDto) {
    return this.jobPostService.update(+id, updateJobPostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobPostService.remove(+id);
  }
}
