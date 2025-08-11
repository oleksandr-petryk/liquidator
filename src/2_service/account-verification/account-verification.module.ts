import { Module } from '@nestjs/common';

import { AccountVerificationDao } from '../../3_componentes/dao/account-verification.dao';
import { UserDao } from '../../3_componentes/dao/user.dao';
import { HandlebarsService } from '../../3_componentes/handlebars/handlebars.service';
import { MailService } from '../../3_componentes/mail/mail.service';
import { AccountVerificationService } from './account-verification.service';

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
