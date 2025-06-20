import {
  Controller,
  Get,
  Body,
  Post,
  Param,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { InterviewService } from './interview.service';
import { JwtAuthGuard } from 'src/common/jwt/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FindAllInterviewDto } from './dto/find-all-interview-company.dto';
import { Request } from 'express';
import { getRoleId, TYPE_ACCOUNT } from 'src/constants';

@Controller('interview')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Get('company')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all interviews (company)' })
  @ApiBearerAuth()
  findAllCompany(@Query() query: FindAllInterviewDto, @Req() req: Request) {
    if (!req.token) {
      throw new Error('Unauthorized: No user found in request');
    }
    if (req.token.role !== getRoleId(TYPE_ACCOUNT.COMPANY)) {
      throw new Error('Unauthorized: User is not company');
    }
    return this.interviewService.findAll(query, req.token.id);
  }

  @Get('company/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get interview by id (company)' })
  @ApiBearerAuth()
  findOneCompany(@Param('id') id: string, @Req() req: Request) {
    if (!req.token) {
      throw new Error('Unauthorized: No user found in request');
    }
    if (req.token.role !== getRoleId(TYPE_ACCOUNT.COMPANY)) {
      throw new Error('Unauthorized: User is not company');
    }
    return this.interviewService.findOne(id, req.token.id);
  }

  @Get('candidate')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all interviews (candidate)' })
  @ApiBearerAuth()
  findAllCandidate(@Query() query: FindAllInterviewDto, @Req() req: Request) {
    if (!req.token) {
      throw new Error('Unauthorized: No user found in request');
    }
    if (req.token.role !== getRoleId(TYPE_ACCOUNT.CANDIDATE)) {
      throw new Error('Unauthorized: User is not candidate');
    }
    return this.interviewService.findAllByCandidate(query, req.token.id);
  }

  @Get('candidate/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get interview by id (candidate)' })
  @ApiBearerAuth()
  findOneCandidate(@Param('id') id: string, @Req() req: Request) {
    if (!req.token) {
      throw new Error('Unauthorized: No user found in request');
    }
    if (req.token.role !== getRoleId(TYPE_ACCOUNT.CANDIDATE)) {
      throw new Error('Unauthorized: User is not candidate');
    }
    return this.interviewService.findOneByCandidate(id, req.token.id);
  }

  @Post('company/:id/result/:result')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update interview result' })
  @ApiBearerAuth()
  updateInterviewResult(
    @Param('id') id: string,
    @Param('result') result: boolean,
    @Req() req: Request,
  ) {
    if (!req.token) {
      throw new Error('Unauthorized: No user found in request');
    }
    if (req.token.role !== getRoleId(TYPE_ACCOUNT.COMPANY)) {
      throw new Error('Unauthorized: User is not company');
    }
    return this.interviewService.updateInterviewResult(
      id,
      req.token.id,
      result,
    );
  }
}
