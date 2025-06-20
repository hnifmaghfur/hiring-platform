import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../common/jwt/jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/company/entities/company.entity';
import { Candidate } from 'src/candidate/entities/candidate.entity';
import { JwtModule } from '@nestjs/jwt';

import { AppJwtService } from '../common/jwt/jwt.service';
import { RedisService } from '../common/redis.service';
import { JWT_CONFIG } from '../constants';
@Module({
  imports: [
    TypeOrmModule.forFeature([Company, Candidate]),
    PassportModule,
    JwtModule.register({
      secret: JWT_CONFIG.SECRET,
      signOptions: { expiresIn: JWT_CONFIG.EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AppJwtService, RedisService, JwtStrategy],
  exports: [AuthService, AppJwtService, RedisService],
})
export class AuthModule {}
