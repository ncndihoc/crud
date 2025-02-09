import { AuthService } from './auth.service';
import { RegisterDto, RegisterResponseDto } from './auth.dto';
import { Controller, Post, SerializeOptions, Body } from '@nestjs/common';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SerializeOptions({ type: RegisterResponseDto })
  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }
}
