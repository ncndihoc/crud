import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SharedModule } from '../../shared/shared.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [SharedModule],
})
export class AuthModule {}
