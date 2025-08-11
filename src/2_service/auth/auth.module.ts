import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from '../../1_control/http/auth.controller';
import { AccountVerificationDao } from '../../3_componentes/dao/account-verification.dao';
import { SessionDao } from '../../3_componentes/dao/session.dao';
import { UserDao } from '../../3_componentes/dao/user.dao';
import { HandlebarsService } from '../../3_componentes/handlebars/handlebars.service';
import { MailService } from '../../3_componentes/mail/mail.service';
import { DtoMapper } from '../../6_model/dto/dto.mapper';
import { AccountVerificationService } from '../account-verification/account-verification.service';
import { SessionService } from '../session/session.service';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { JwtInternalService } from './jwt-internal.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtInternalService,
    UserDao,
    AccountVerificationDao,
    AccountVerificationService,
    DtoMapper,
    SessionDao,
    UserService,
    SessionService,
    MailService,
    HandlebarsService,
  ],
  imports: [JwtModule],
  exports: [AuthService, JwtInternalService],
})
export class AuthModule {}
