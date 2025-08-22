import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { ClientFingerprintSelectModel } from '../../3_components/dao/client-fingerprint.dao';
import {
  PasswordResetRequestDao,
  PasswordResetRequestSelectModel,
} from '../../3_components/dao/password-reset-request.dao';
import { HandlebarsService } from '../../3_components/handlebars/handlebars.service';
import { MailService } from '../../3_components/mail/mail.service';
import { TemplatesEnum } from '../../5_shared/misc/handlebars/email/template-names';
import { generate6DigitsCode } from '../../5_shared/utils/db.util';
import { ActivityLogCreationService } from '../activity-log/activity-log-creation.service';

@Injectable()
export class PasswordResetRequestService {
  constructor(
    private readonly passwordResetRequestDao: PasswordResetRequestDao,
    private readonly mailService: MailService,
    private readonly handlebarsService: HandlebarsService,
    private readonly activityLogCreationService: ActivityLogCreationService,
  ) {}

  public async canResetPassword({
    fingerprint,
    passwordResetRequestRecord,
    code,
    userId,
  }: {
    fingerprint: ClientFingerprintSelectModel;
    passwordResetRequestRecord: Omit<PasswordResetRequestSelectModel, 'user'>;
    code: string;
    userId?: string;
  }): Promise<boolean> {
    if (!(await bcrypt.compare(code, passwordResetRequestRecord.code))) {
      if (userId) {
        await this.activityLogCreationService.createLog_ResetPasswordFailedWithWrongCode(
          {
            userId,
            clientFingerprintId: fingerprint.id,
          },
        );
      }

      return false;
    }

    if (passwordResetRequestRecord.expiresAt < new Date()) {
      return false;
    }

    return true;
  }

  public async canSendRequest({
    fingerprint,
    userId,
  }: {
    fingerprint: ClientFingerprintSelectModel;
    userId: string;
  }): Promise<boolean> {
    const records = await this.passwordResetRequestDao.findManyByUserId({
      userId,
    });

    if (records.length !== 0) {
      if (records.length >= 10) {
        await this.activityLogCreationService.createLog_SendPasswordResetEmailFailedReachedLimit(
          {
            userId,
            clientFingerprintId: fingerprint.id,
          },
        );

        return false;
      }

      if (
        (new Date().getTime() -
          new Date(records[records.length - 1].createdAt).getTime()) /
          1000 <
        60
      ) {
        return false;
      }
    }
    return true;
  }

  public async sendRequest({
    username,
    email,
    userId,
  }: {
    username: string;
    email: string;
    userId: string;
  }): Promise<Omit<PasswordResetRequestSelectModel, 'user'>> {
    const saltRounds = 10; // TODO: use different salt each time

    const code = generate6DigitsCode();

    const passwordResetRequestRecord =
      await this.passwordResetRequestDao.create({
        data: {
          userId: userId,
          code: await bcrypt.hash(code, saltRounds),
          expiresAt: new Date(new Date().getTime() + 600000), // current date + 10 minutes (1000 * 60 * 10)
        },
      });

    await this.mailService.sendEmail({
      to: email,
      subject: 'Password reset',
      html: await this.handlebarsService.render(TemplatesEnum.emailReset, {
        name: username,
        email: email,
        code: code,
        expiresAt: passwordResetRequestRecord.expiresAt,
        year: new Date().getFullYear(),
      }),
    });

    return passwordResetRequestRecord;
  }
}
