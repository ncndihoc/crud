import { AuthService } from './auth.service';
import { RegisterDto, RegisterResponseDto } from './auth.dto';
import { Controller, Post, Body } from '@nestjs/common';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return new RegisterResponseDto(await this.authService.register(body));
  }
}
