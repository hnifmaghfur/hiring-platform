import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getRoleId, JWT_CONFIG } from '../../constants';

@Injectable()
export class AppJwtService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(user: any, type: string) {
    const payload = {
      sub: user.id,
      username: user.email,
      role: getRoleId(type),
    };
    return this.jwtService.sign(payload, {
      expiresIn: '1h',
    });
  }

  generateRefreshToken(user: any, expiresIn: number) {
    const payload = { sub: user.id };
    return this.jwtService.sign(payload, {
      expiresIn,
      secret: JWT_CONFIG.REFRESH_SECRET,
    });
  }

  verifyToken(token: string) {
    return this.jwtService.verify(token, {
      secret: JWT_CONFIG.SECRET,
    });
  }

  verifyRefreshToken(token: string) {
    return this.jwtService.verify(token, {
      secret: JWT_CONFIG.REFRESH_SECRET,
    });
  }
}
