import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { CustomLogger } from '../../common/app-logger';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly logger: CustomLogger = new CustomLogger(),
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const ctx = 'CompanyService.create';
    try {
      // Hash password with bcrypt
      const hashedPassword = await bcrypt.hash(createCompanyDto.password, 10);
      const company = this.companyRepository.create({
        ...createCompanyDto,
        password: hashedPassword,
      });
      const saved = await this.companyRepository.save(company);

      // Remove password before returning
      const { password, ...result } = saved;
      this.logger.log(`[${ctx}] Company created id: ${saved.id}`);
      return result;
    } catch (error) {
      this.logger.error(`[${ctx}] Error creating company: ${error.message}`);
      throw error;
    }
  }

  findAll() {
    return `This action returns all company`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
