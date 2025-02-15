import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import envConfig from '../config';
import { TokenPayload } from '../types/jwt.types';
@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  signAccessToken(payload: { userId: number }) {
    return this.jwtService.sign(payload, {
      secret: envConfig.ACCESS_TOKEN_SECRET,
      expiresIn: envConfig.ACCESS_TOKEN_EXPIRATION,
      algorithm: 'HS256',
    });
  }

  signRefreshToken(payload: { userId: number }) {
    return this.jwtService.sign(payload, {
      secret: envConfig.REFRESH_TOKEN_SECRET,
      expiresIn: envConfig.REFRESH_TOKEN_EXPIRATION,
      algorithm: 'HS256',
    });
  }

  verifyAccessToken(token: string) {
    return this.jwtService.verifyAsync<TokenPayload>(token, {
      secret: envConfig.ACCESS_TOKEN_SECRET,
    });
  }

  verifyRefreshToken(token: string) {
    return this.jwtService.verifyAsync<TokenPayload>(token, {
      secret: envConfig.REFRESH_TOKEN_SECRET,
    });
  }
}
