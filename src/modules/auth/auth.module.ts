import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { SessionDao } from '../../shared/dao/session.dao';
import { UserDao } from '../../shared/dao/user.dao';
import { DtoMapper } from '../../shared/services/dto.mapper';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { JwtInternalService } from './services/jwt-internal.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtInternalService, UserDao, DtoMapper, SessionDao],
  imports: [JwtModule],
  exports: [AuthService, JwtInternalService],
})
export class AuthModule {}
