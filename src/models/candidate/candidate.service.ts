import { Injectable } from '@nestjs/common';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { Candidate } from './entities/candidate.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CustomLogger } from '../../common/app-logger';

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
    private readonly logger: CustomLogger = new CustomLogger(),
  ) {}

  async create(createCandidateDto: CreateCandidateDto) {
    const ctx = 'CandidateService.create';
    try {
      // Hash password with bcrypt
      const hashedPassword = await bcrypt.hash(createCandidateDto.password, 10);
      const candidate = this.candidateRepository.create({
        ...createCandidateDto,
        password: hashedPassword,
      });
      const saved = await this.candidateRepository.save(candidate);
      this.logger.log(`[${ctx}] Candidate created id: ${saved.id}`);
      // Remove password before returning
      const { password, ...result } = saved;
      return result;
    } catch (error) {
      this.logger.error(`[${ctx}] Error creating candidate: ${error.message}`);
      throw error;
    }
  }

  findAll() {
    return `This action returns all candidate`;
  }

  findOne(id: number) {
    return `This action returns a #${id} candidate`;
  }

  update(id: number, updateCandidateDto: UpdateCandidateDto) {
    return `This action updates a #${id} candidate`;
  }

  remove(id: number) {
    return `This action removes a #${id} candidate`;
  }
}
