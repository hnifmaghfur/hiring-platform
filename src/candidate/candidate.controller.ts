import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { CandidateService } from './candidate.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { GlobalValidationPipe } from '../common/validate.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../utils/multer.config';
import {
  CandidateRegisterApiBody as RegisterBody,
  CandidateRegisterApiResponse as RegisterResp,
} from './schema/candidate-swagger.schema';
import { createdResponse } from '../common/global.schema';
import { BadRequestResponse } from '../common/global.schema';
import { InternalServerErrorResponse } from '../common/global.schema';

@Controller('candidate')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('resume', multerConfig))
  @ApiOperation({ summary: 'Register a candidate with resume upload' })
  @ApiConsumes('multipart/form-data')
  @ApiBody(RegisterBody)
  @ApiResponse(createdResponse(RegisterResp.description, RegisterResp.schema))
  @ApiResponse(BadRequestResponse('Bad request'))
  @ApiResponse(InternalServerErrorResponse('Internal server error'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body(GlobalValidationPipe) createCandidateDto: CreateCandidateDto,
  ) {
    return this.candidateService.create({
      ...createCandidateDto,
      resume: file?.filename,
    });
  }

  @Get()
  findAll() {
    return this.candidateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.candidateService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCandidateDto: UpdateCandidateDto,
  ) {
    return this.candidateService.update(+id, updateCandidateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.candidateService.remove(+id);
  }
}
