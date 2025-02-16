import { Exclude } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';
import { Match } from 'src/shared/decorator/match-validation.decorator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 20, {
    message: 'Password must be between 6 and 20 characters',
  })
  password: string;
}

export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;

  constructor(partial: Partial<LoginResponseDto>) {
    Object.assign(this, partial);
  }
}

export class RegisterDto extends LoginDto {
  @IsString()
  name: string;

  @IsString()
  @Match('password')
  confirmPassword: string;
}

export class RegisterResponseDto {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  password: string;

  constructor(partial: Partial<RegisterResponseDto>) {
    Object.assign(this, partial);
  }
}

export class RefreshTokenBodyDto {
  @IsString()
  refreshToken: string;
}

export class RefreshTokenResponseDto extends LoginResponseDto {}
