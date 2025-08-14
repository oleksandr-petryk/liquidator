import { Module } from '@nestjs/common';

import { DaoModule } from '../../3_componentes/dao/dao.module';
import { HandlebarsService } from '../../3_componentes/handlebars/handlebars.service';
import { MailService } from '../../3_componentes/mail/mail.service';
import { UserService } from '../user/user.service';
import { PasswordResetRequestService } from './password-reset-request.service';

@Module({
  providers: [
    PasswordResetRequestService,
    UserService,
    MailService,
    HandlebarsService,
  ],
  imports: [DaoModule],
  exports: [PasswordResetRequestService],
})
export class PasswordResetRequestModule {}
