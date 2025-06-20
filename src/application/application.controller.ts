import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ApplicationService } from './application.service';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt/jwt-auth.guard';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post(':job_post_id')
  @UseGuards(JwtAuthGuard)
  async create(@Param('job_post_id') job_post_id: string, @Req() req: Request) {
    if (!req.token) {
      throw new Error('Unauthorized: No user found in request');
    }
    return await this.applicationService.create({
      job_post_id,
      candidate_id: req.token.id,
    });
  }

  @Get()
  findAll() {
    return this.applicationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ) {
    return this.applicationService.update(+id, updateApplicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicationService.remove(+id);
  }
}
