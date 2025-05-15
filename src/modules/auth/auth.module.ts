import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { AuthControllerService } from './services/auth-controller.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthControllerService],
})
export class AuthModule {}
