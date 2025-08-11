import {
  BadRequestException,
  GoneException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import {
  AccountVerificationDao,
  AccountVerificationSelectModel,
} from '../../../shared/dao/account-verification.dao';
import { UserDao } from '../../../shared/dao/user.dao';
import {
  generateVerificationCode,
  nonNullableUtils,
} from '../../../shared/utils/db.util';
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

  public async getByUserId(
    userId: string,
  ): Promise<AccountVerificationSelectModel> {
    const result = await this.accountVerificationDao.findByUserId({ userId });

    return nonNullableUtils(
      result,
      new BadRequestException(
        'Account verification record not found, id: ' + userId,
      ),
    );
  }

  public async canVerifyAccount({
    userId,
    code,
  }: {
    userId: string;
    code?: string;
  }): Promise<void> {
    const accountVerificationRecord = await this.getByUserId(userId);

    if (code !== undefined && accountVerificationRecord.code !== code) {
      throw new UnauthorizedException('Code wrong');
    }

    if (
      code !== undefined &&
      accountVerificationRecord.expiresAt < new Date()
    ) {
      throw new GoneException('The code has expired');
    }

    if ((await this.userDao.findById({ id: userId }))?.verifyed === true) {
      throw new BadRequestException('User is already verified');
    }
  }

  public async verifyUserAccount({
    userId,
    code,
  }: {
    userId: string;
    code: string;
  }): Promise<void> {
    await this.canVerifyAccount({ userId, code });

    await this.userDao.update({
      data: { verifyed: true },
      id: userId,
    });
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
  }): Promise<AccountVerificationSelectModel> {
    const accountVerificationRecord = await this.accountVerificationDao.create({
      data: {
        userId: userId,
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
