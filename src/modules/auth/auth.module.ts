import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserDao } from '../../shared/dao/user.dto';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { JwtInternalService } from './services/jwt-internal.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtInternalService, UserDao],
  imports: [JwtModule],
  exports: [AuthService, JwtInternalService],
})
export class AuthModule {}
