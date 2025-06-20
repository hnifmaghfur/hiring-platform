import { Injectable } from '@nestjs/common';
import { CustomLogger } from '../common/app-logger';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Candidate } from 'src/candidate/entities/candidate.entity';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    private readonly logger: CustomLogger = new CustomLogger(),
  ) {}
  async create(createApplicationDto: CreateApplicationDto) {
    const ctx = 'ApplicationService.create';
    try {
      const user = await this.candidateRepository.findOne({
        where: { id: createApplicationDto.candidate_id },
      });
      if (!user) {
        throw new Error('User not found');
      }
      const application =
        this.applicationRepository.create(createApplicationDto);
      const saved = await this.applicationRepository.save(application);
      this.logger.log(`[${ctx}] Application created id: ${saved.id}`);
      return saved;
    } catch (error) {
      this.logger.error(
        `[${ctx}] Error creating application: ${error.message}`,
      );
      throw new Error(error.message);
    }
  }

  findAll() {
    return `This action returns all application`;
  }

  findOne(id: number) {
    return `This action returns a #${id} application`;
  }

  update(id: number, updateApplicationDto: UpdateApplicationDto) {
    return `This action updates a #${id} application`;
  }

  remove(id: number) {
    return `This action removes a #${id} application`;
  }
}
