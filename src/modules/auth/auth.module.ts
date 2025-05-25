import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { AuthControllerService } from './services/auth-controller.service';
import { JwtInternalService } from './services/jwt-internal.service';

@Module({
  controllers: [AuthController],
  providers: [AuthControllerService, AuthService, JwtInternalService],
  exports: [AuthService, JwtInternalService],
})
export class AuthModule {}
