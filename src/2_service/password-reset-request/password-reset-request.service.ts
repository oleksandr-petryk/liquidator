import {
  BadRequestException,
  GoneException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import {
  PasswordResetRequestDao,
  PasswordResetRequestSelectModel,
} from '../../3_componentes/dao/password-reset-request.dao';
import { HandlebarsService } from '../../3_componentes/handlebars/handlebars.service';
import { MailService } from '../../3_componentes/mail/mail.service';
import {
  generate6DigitsCode,
  nonNullableUtils,
} from '../../5_shared/utils/db.util';
import { UserService } from '../user/user.service';

@Injectable()
export class PasswordResetRequestService {
  constructor(
    private readonly passwordResetRequestDao: PasswordResetRequestDao,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly handlebarsService: HandlebarsService,
  ) {}

  public async getByUserId(
    userId: string,
  ): Promise<Omit<PasswordResetRequestSelectModel, 'user'>> {
    const result = await this.passwordResetRequestDao.findByUserId({ userId });

    return nonNullableUtils(
      result,
      new BadRequestException(
        'Account verification record not found, id: ' + userId,
      ),
    );
  }

  public async canResetPassword({
    userId,
    code,
  }: {
    userId: string;
    code: string;
  }): Promise<void> {
    const passwordResetRequestRecord = await this.getByUserId(userId);

    if (passwordResetRequestRecord.code !== code) {
      throw new UnauthorizedException();
    }

    if (passwordResetRequestRecord.expiresAt < new Date()) {
      throw new GoneException();
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
  }): Promise<void> {
    const user = await this.userService.getByEmail({ email });

    this.canResetPassword({ userId: user.id, code });

    const saltRounds = 10; // TODO: use different salt each time

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    this.userService.changePassword({
      newPassword: hashedPassword,
      userId: user.id,
    });
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
