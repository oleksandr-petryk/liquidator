import { Module } from '@nestjs/common';

import { DaoModule } from '../../3_components/dao/dao.module';
import { HandlebarsService } from '../../3_components/handlebars/handlebars.service';
import { MailService } from '../../3_components/mail/mail.service';
import { ActivityLogCreationService } from '../activity-log/activity-log-creation.service';
import { PasswordResetRequestService } from './password-reset-request.service';

@Module({
  providers: [
    PasswordResetRequestService,
    MailService,
    HandlebarsService,
    ActivityLogCreationService,
  ],
  imports: [DaoModule],
  exports: [PasswordResetRequestService],
})
export class PasswordResetRequestModule {}
