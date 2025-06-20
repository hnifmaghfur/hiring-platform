import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UpdateAuthDto } from './dto/update-token.dto';
import { Candidate } from '../candidate/entities/candidate.entity';
import { Company } from '../company/entities/company.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppJwtService } from '../../common/jwt/jwt.service';
import { RedisService } from '../../common/redis.service';
import { JWT_CONFIG } from '../../constants';
import { CustomLogger } from '../../common/app-logger';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly jwtService: AppJwtService,
    private readonly redisService: RedisService,
    private readonly logger: CustomLogger = new CustomLogger(),
  ) {}

  async templateLogin(
    type: string,
    loginDto: LoginDto,
    repository: Repository<any>,
  ) {
    const ctx = `AuthService.${type}Login`;
    try {
      const { email, password } = loginDto;
      const user = await repository.findOne({
        where: { email },
      });
      if (!user) {
        throw new Error('user not found');
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Invalid password');
      }

      const token = this.jwtService.generateToken(user, type);
      const expiredIn = 60 * 60 * 24 * 7;
      const refreshToken = this.jwtService.generateRefreshToken(
        user,
        expiredIn,
      );

      const encToken = bcrypt.hashSync(
        `${refreshToken}${JWT_CONFIG.REFRESH_TOKEN_RANDOM}`,
        10,
      );

      // store refresh token in redis
      await this.redisService.set(
        `refreshToken_${type}_${user.id}`,
        encToken,
        expiredIn,
      );

      this.logger.log(`[${ctx}] User logged in id: ${user.id}`);
      return { user, token, refreshToken };
    } catch (error) {
      this.logger.error(`[${ctx}] Error logging in: ${error.message}`);
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    try {
      return this.templateLogin(
        'candidate',
        loginDto,
        this.candidateRepository,
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async companyLogin(loginDto: LoginDto) {
    try {
      return this.templateLogin('company', loginDto, this.companyRepository);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async tempateUpdateToken(
    type: string,
    oldRefreshToken: string,
    repository: Repository<any>,
  ) {
    const ctx = `AuthService.${type}UpdateToken`;
    try {
      const id = this.jwtService.verifyRefreshToken(oldRefreshToken);
      const user = await repository.findOne({ where: { id } });
      if (!user) {
        throw new Error('user not found');
      }

      const storeToken = await this.redisService.get(
        `refreshToken_${type}_${user.id}`,
      );
      if (!storeToken) {
        throw new Error('refresh token not found');
      }

      const isMatch = await bcrypt.compare(
        `${oldRefreshToken}${JWT_CONFIG.REFRESH_TOKEN_RANDOM}`,
        storeToken,
      );
      if (!isMatch) {
        throw new Error('Invalid refresh token');
      }

      const token = this.jwtService.generateToken(user, type);
      const expiredIn = 60 * 60 * 24 * 7;
      const refreshToken = this.jwtService.generateRefreshToken(
        user,
        expiredIn,
      );

      const encToken = bcrypt.hashSync(
        `${refreshToken}${JWT_CONFIG.REFRESH_TOKEN_RANDOM}`,
        10,
      );

      // store refresh token in redis
      await this.redisService.set(
        `refreshToken_${type}_${user.id}`,
        encToken,
        expiredIn,
      );

      this.logger.log(`[${ctx}] User updated token id: ${user.id}`);
      return { user, token, refreshToken };
    } catch (error) {
      this.logger.error(`[${ctx}] Error updating token: ${error.message}`);
      throw error;
    }
  }

  async updateTokenCandidate(refreshToken: string) {
    try {
      return this.tempateUpdateToken(
        'candidate',
        refreshToken,
        this.candidateRepository,
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateTokenCompany(refreshToken: string) {
    try {
      return this.tempateUpdateToken(
        'company',
        refreshToken,
        this.companyRepository,
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
