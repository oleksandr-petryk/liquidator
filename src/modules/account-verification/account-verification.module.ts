import { Module } from '@nestjs/common';

import { AccountVerificationDao } from '../../shared/dao/account-verification.dao';
import { UserDao } from '../../shared/dao/user.dao';
import { HandlebarsService } from '../handlebars/services/handlebars.service';
import { MailService } from '../mail/services/mail.service';
import { AccountVerificationService } from './services/account-verification.service';

@Module({
  providers: [
    AccountVerificationService,
    AccountVerificationDao,
    UserDao,
    MailService,
    HandlebarsService,
  ],
  exports: [AccountVerificationService],
})
export class AccountVerificationModule {}
