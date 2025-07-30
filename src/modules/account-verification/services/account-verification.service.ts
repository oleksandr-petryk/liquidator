import { BadRequestException, GoneException, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import {
  AccountVerificationDao,
  AccountVerificationSelectModel,
} from '../../../shared/dao/account-verification.dao';
import { UserDao } from '../../../shared/dao/user.dao';
import { user } from '../../../shared/modules/drizzle/schemas';
import { generateVerificationCode } from '../../../shared/utils/db.util';
import { HandlebarsService } from '../../handlebars/services/handlebars.service';
import { MailService } from '../../mail/services/mail.service';

@Injectable()
export class AccountVerificationService {
  constructor(
    private readonly accountVerificationDao: AccountVerificationDao,
    private readonly userDao: UserDao,
    private readonly mailService: MailService,
    private readonly handlebarsService: HandlebarsService,
  ) {}

  public async canVerifyAccount(userId: string): Promise<void> {
    if (
      (await this.accountVerificationDao.getByUserId(userId)).expiresAt <
      new Date()
    ) {
      throw new GoneException('The code has expired');
    }

    if (
      (
        await this.accountVerificationDao.postgresDatabase.query.user.findFirst(
          {
            where: eq(user.id, userId),
          },
        )
      )?.verifyed === true
    ) {
      throw new BadRequestException('User is already verified');
    }
  }

  public async verifyUserAccount(userId: string): Promise<void> {
    await this.canVerifyAccount(userId);

    await this.userDao.update({
      data: { verifyed: true },
      id: userId,
    });
  }

  public async sendRequest({
    template,
    username,
    email,
    id,
  }: {
    template: string;
    username: string;
    email: string;
    id: string;
  }): Promise<AccountVerificationSelectModel> {
    const accountVerificationRecord = await this.accountVerificationDao.create({
      data: {
        userId: id,
        code: generateVerificationCode(),
        expiresAt: new Date(new Date().getTime() + 42200000), // current data + 12 hours (1000 * 60 * 60 * 12)
      },
    });

    await this.mailService.sendEmail({
      to: email,
      subject: 'verification approval',
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
