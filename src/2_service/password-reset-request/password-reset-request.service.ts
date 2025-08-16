import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import {
  PasswordResetRequestDao,
  PasswordResetRequestSelectModel,
} from '../../3_componentes/dao/password-reset-request.dao';
import { UserDao } from '../../3_componentes/dao/user.dao';
import { HandlebarsService } from '../../3_componentes/handlebars/handlebars.service';
import { MailService } from '../../3_componentes/mail/mail.service';
import { generate6DigitsCode } from '../../5_shared/utils/db.util';
import { PasswordResetResponseBodyDto } from '../../6_model/dto/io/auth/response-body.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class PasswordResetRequestService {
  constructor(
    private readonly passwordResetRequestDao: PasswordResetRequestDao,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly handlebarsService: HandlebarsService,
    private readonly userDao: UserDao,
  ) {}

  public canResetPassword({
    passwordResetRequestRecord,
    code,
  }: {
    passwordResetRequestRecord: Omit<PasswordResetRequestSelectModel, 'user'>;
    code: string;
  }): void | boolean {
    if (passwordResetRequestRecord.code !== code) {
      return false;
    }

    if (passwordResetRequestRecord.expiresAt < new Date()) {
      return false;
    }
  }

  async passwordReset({
    email,
    code,
    newPassword,
  }: {
    email: string;
    code: string;
    newPassword: string;
  }): Promise<PasswordResetResponseBodyDto | undefined> {
    const user = await this.userDao.findByEmail({ email });

    if (!user) {
      return;
    }

    const passwordResetRequestRecord =
      await this.passwordResetRequestDao.findByUserId({ userId: user.id });

    if (
      this.canResetPassword({
        passwordResetRequestRecord,
        code,
      }) === false
    ) {
      return;
    }

    const saltRounds = 10; // TODO: use different salt each time

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    this.userService.changePassword({
      newPassword: hashedPassword,
      userId: user.id,
    });

    return { message: 'Password successfully changed' };
  }

  public async canSendRequest(userId: string): Promise<boolean> {
    const records = await this.passwordResetRequestDao.findManyByUserId({
      userId,
    });

    if (records.length !== 0) {
      if (records.length >= 10) {
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
    template,
    username,
    email,
    userId,
  }: {
    template: string;
    username: string;
    email: string;
    userId: string;
  }): Promise<Omit<PasswordResetRequestSelectModel, 'user'>> {
    const accountVerificationRecord = await this.passwordResetRequestDao.create(
      {
        data: {
          userId: userId,
          code: generate6DigitsCode(),
          expiresAt: new Date(new Date().getTime() + 600000), // current date + 10 minuts (1000 * 60 * 10)
        },
      },
    );

    await this.mailService.sendEmail({
      to: email,
      subject: 'Password reset',
      html: await this.handlebarsService.render(template, {
        name: username,
        email: email,
        code: accountVerificationRecord.code,
        expiresAt: accountVerificationRecord.expiresAt,
        year: new Date().getFullYear(),
      }),
    });

    return accountVerificationRecord;
  }
}
