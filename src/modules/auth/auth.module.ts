import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AccountVerificationDao } from '../../shared/dao/account-verification.dao';
import { SessionDao } from '../../shared/dao/session.dao';
import { UserDao } from '../../shared/dao/user.dao';
import { DtoMapper } from '../../shared/services/dto.mapper';
import { AccountVerificationService } from '../account-verification/services/account-verification.service';
import { HandlebarsService } from '../handlebars/services/handlebars.service';
import { MailService } from '../mail/services/mail.service';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { JwtInternalService } from './services/jwt-internal.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtInternalService,
    UserDao,
    AccountVerificationDao,
    DtoMapper,
    SessionDao,
    AccountVerificationService,
    MailService,
    HandlebarsService,
  ],
  imports: [JwtModule],
  exports: [AuthService, JwtInternalService],
})
export class AuthModule {}
