import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { HashingService } from '../../shared/services/hashing.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { TokenService } from '../../shared/services/token.service';
import {
  isNotFoundPrismaError,
  isUniqueConstraintPrismaError,
} from '../../shared/helpers';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
    private readonly prismaService: PrismaService,
  ) {}

  async register(body: RegisterDto) {
    try {
      const hashedPassword = await this.hashingService.hash(body.password);
      const user = await this.prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          password: hashedPassword,
        },
      });
      return user;
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw new ConflictException('User already exists');
      }
      throw new Error('Failed to register user');
    }
  }

  async login(body: LoginDto) {
    // check if user exists
    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });
    if (!user) {
      throw new UnprocessableEntityException({
        field: 'email',
        message: 'User not found',
      });
    }
    // check if password is correct
    const isPasswordValid = await this.hashingService.compare(
      body.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnprocessableEntityException({
        field: 'password',
        message: 'Incorrect password',
      });
    }
    // generate tokens
    const tokens = await this.generateTokens(user.id);
    return tokens;
  }

  async generateTokens(userId: number) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken({ userId }),
      this.tokenService.signRefreshToken({ userId }),
    ]);
    // decode refresh token to save in db
    const decodedRefreshToken =
      await this.tokenService.verifyRefreshToken(refreshToken);
    await this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: decodedRefreshToken.userId,
        expiresAt: new Date(decodedRefreshToken.exp * 1000),
      },
    });
    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      // verify refresh token
      const { userId } =
        await this.tokenService.verifyRefreshToken(refreshToken);

      // check if refresh token is valid
      await this.prisma.refreshToken.findUniqueOrThrow({
        where: { token: refreshToken },
      });

      // delete refresh token from db
      await this.prisma.refreshToken.delete({
        where: { token: refreshToken },
      });

      // generate new tokens
      return await this.generateTokens(userId);
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new UnauthorizedException('Refresh token is revoked');
      }
      if (
        error.name === 'JsonWebTokenError' ||
        error.name === 'TokenExpiredError'
      ) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      throw new UnauthorizedException('Failed to refresh token');
    }
  }
}
