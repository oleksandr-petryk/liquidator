import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import {
  PasswordResetRequestDao,
  PasswordResetRequestSelectModel,
} from '../../3_componentes/dao/password-reset-request.dao';
import { HandlebarsService } from '../../3_componentes/handlebars/handlebars.service';
import { MailService } from '../../3_componentes/mail/mail.service';
import {
  generateVerificationCode,
  nonNullableUtils,
} from '../../5_shared/utils/db.util';

@Injectable()
export class PasswordResetRequestService {
  constructor(
    private readonly PasswordResetRequestDao: PasswordResetRequestDao,
    private readonly mailService: MailService,
    private readonly handlebarsService: HandlebarsService,
  ) {}

  public async getByUserId(
    userId: string,
  ): Promise<Omit<PasswordResetRequestSelectModel, 'user'>> {
    const result = await this.PasswordResetRequestDao.findByUserId({ userId });

    return nonNullableUtils(
      result,
      new BadRequestException(
        'Account verification record not found, id: ' + userId,
      ),
    );
  }

  public async canSendRequest(userId: string): Promise<void> {
    const records = await this.PasswordResetRequestDao.findManyByUserId({
      userId,
    });

    if (records.length !== 0) {
      if (records.length >= 10) {
        throw new HttpException(
          'You send too many password reset requests',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      console.log(
        new Date(records[records.length - 1].createdAt).getTime(),
        '<========= time',
      );

      console.log('Now:', new Date());
      console.log(
        'Last request:',
        new Date(records[records.length - 1].createdAt),
      );

      console.log(new Date().getTime(), '<====== cur');

      console.log(
        (new Date(records[records.length - 1].createdAt).getTime() -
          new Date().getTime()) /
          1000,
      );

      if (
        (new Date().getTime() -
          new Date(records[records.length - 1].createdAt).getTime()) /
          1000 <
        60
      ) {
        throw new HttpException(
          'Please wait 1 minute before requesting a password change again',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    }
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
    const accountVerificationRecord = await this.PasswordResetRequestDao.create(
      {
        data: {
          userId: userId,
          code: generateVerificationCode(),
          expiresAt: new Date(new Date().getTime() + 42200000), // current data + 12 hours (1000 * 60 * 60 * 12)
        },
      },
    );

    await this.mailService.sendEmail({
      to: email,
      subject: 'Password reset',
      html: await this.handlebarsService.render(template, {
        name: username,
        email: email,
        resetLink: 'in work',
        expiresAt: accountVerificationRecord.expiresAt,
        year: new Date().getFullYear(),
      }),
    });

    return accountVerificationRecord;
  }
}
