import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from '../../1_control/http/auth.controller';
import { DaoModule } from '../../3_components/dao/dao.module';
import { HandlebarsService } from '../../3_components/handlebars/handlebars.service';
import { MailService } from '../../3_components/mail/mail.service';
import { DtoMapper } from '../../6_model/dto/dto.mapper';
import { AccountVerificationService } from '../account-verification/account-verification.service';
import { ActivityLogCreationService } from '../activity-log/activity-log-creation.service';
import { TransactionService } from '../database/database.service';
import { OrganizationService } from '../organization/organization.service';
import { PasswordResetRequestService } from '../password-reset-request/password-reset-request.service';
import { SessionService } from '../session/session.service';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { JwtInternalService } from './jwt-internal.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    ActivityLogCreationService,
    TransactionService,
    OrganizationService,
    JwtInternalService,
    AccountVerificationService,
    DtoMapper,
    UserService,
    SessionService,
    MailService,
    HandlebarsService,
    PasswordResetRequestService,
    MailService,
    HandlebarsService,
  ],
  imports: [JwtModule, DaoModule],
  exports: [AuthService, JwtInternalService],
})
export class AuthModule {}
