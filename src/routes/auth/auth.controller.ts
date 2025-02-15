import { AuthService } from './auth.service';
import {
  LoginDto,
  LoginResponseDto,
  RefreshTokenBodyDto,
  RefreshTokenResponseDto,
  RegisterDto,
  RegisterResponseDto,
} from './auth.dto';
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return new RegisterResponseDto(await this.authService.register(body));
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return new LoginResponseDto(await this.authService.login(body));
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: RefreshTokenBodyDto) {
    return new RefreshTokenResponseDto(
      await this.authService.refreshToken(body.refreshToken),
    );
  }
}
