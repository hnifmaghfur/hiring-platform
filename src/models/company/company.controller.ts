import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { GlobalValidationPipe } from '../../common/validate.pipe';
import { createdResponse } from '../../common/global.schema';
import { BadRequestResponse } from '../../common/global.schema';
import { InternalServerErrorResponse } from '../../common/global.schema';
import { CompanyRegisterApiResponse as RegisterResp } from './schema/company-swagger.schema';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a company' })
  @ApiConsumes('application/json')
  @ApiBody({ type: CreateCompanyDto })
  @ApiResponse(createdResponse(RegisterResp.description, RegisterResp.schema))
  @ApiResponse(BadRequestResponse('Bad request'))
  @ApiResponse(InternalServerErrorResponse('Internal server error'))
  create(@Body(GlobalValidationPipe) createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(+id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }
}
