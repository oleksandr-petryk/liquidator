import { Module } from '@nestjs/common';

import { DaoModule } from '../../3_components/dao/dao.module';
import { HandlebarsService } from '../../3_components/handlebars/handlebars.service';
import { MailService } from '../../3_components/mail/mail.service';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { ClientFingerprintService } from '../client-fingerprint/client-fingerprint.service';
import { SessionService } from '../session/session.service';
import { AccountVerificationService } from './account-verification.service';

@Module({
  providers: [
    AccountVerificationService,
    MailService,
    HandlebarsService,
    ClientFingerprintService,
    ActivityLogService,
    SessionService,
  ],
  imports: [DaoModule],
  exports: [AccountVerificationService],
})
export class AccountVerificationModule {}
