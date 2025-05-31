import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { SessionDao } from '../../shared/dao/session.dto';
import { UserDao } from '../../shared/dao/user.dto';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { AuthControllerService } from './services/auth-controller.service';
import { JwtInternalService } from './services/jwt-internal.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthControllerService,
    AuthService,
    JwtInternalService,
    UserDao,
    SessionDao,
  ],
  imports: [JwtModule],
  exports: [AuthService, JwtInternalService],
})
export class AuthModule {}
