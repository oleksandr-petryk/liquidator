import {
  BadRequestException,
  GoneException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import {
  AccountVerificationDao,
  AccountVerificationSelectModel,
} from '../../3_components/dao/account-verification.dao';
import { UserDao } from '../../3_components/dao/user.dao';
import { HandlebarsService } from '../../3_components/handlebars/handlebars.service';
import { MailService } from '../../3_components/mail/mail.service';
import { JwtTokenPayload } from '../../5_shared/interfaces/jwt-token.interface';
import { TemplatesEnum } from '../../5_shared/misc/handlebars/email/template-names';
import {
  generate6DigitsCode,
  nonNullableUtils,
} from '../../5_shared/utils/db.util';
import { ActivityLogCreationService } from '../activity-log/activity-log-creation.service';
import { SessionService } from '../session/session.service';

@Injectable()
export class AccountVerificationService {
  constructor(
    private readonly accountVerificationDao: AccountVerificationDao,
    private readonly userDao: UserDao,
    private readonly mailService: MailService,
    private readonly handlebarsService: HandlebarsService,
    private readonly activityLogCreationService: ActivityLogCreationService,
    private readonly sessionService: SessionService,
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
    user,
    code,
  }: {
    user: JwtTokenPayload;
    code?: string;
  }): Promise<void> {
    const accountVerificationRecord = await this.getByUserId(user.id);

    if (code !== undefined && accountVerificationRecord.code !== code) {
      const sessionRecord = await this.sessionService.getByJtiAndUserId(user);

      await this.activityLogCreationService.createLog_AccountVerificationFailedWithWrongCode(
        {
          userId: user.id,
          clientFingerprintId: sessionRecord.clientFingerprintId,
        },
      );

      throw new UnauthorizedException('Code wrong');
    }

    if (
      code !== undefined &&
      accountVerificationRecord.expiresAt < new Date()
    ) {
      throw new GoneException('The code has expired');
    }

    if ((await this.userDao.findById({ id: user.id }))?.verified === true) {
      throw new BadRequestException('User is already verified');
    }
  }

  public async verifyUserAccount({
    user,
    code,
  }: {
    user: JwtTokenPayload;
    code: string;
  }): Promise<void> {
    await this.canVerifyAccount({ user, code });

    await this.userDao.update({
      data: { verified: true },
      id: user.id,
    });

    const sessionRecord = await this.sessionService.getByJtiAndUserId(user);

    await this.activityLogCreationService.createLog_AccountVerification({
      userId: user.id,
      clientFingerprintId: sessionRecord.clientFingerprintId,
    });
  }

  public async sendRequest({
    username,
    email,
    userId,
  }: {
    username: string;
    email: string;
    userId: string;
  }): Promise<AccountVerificationSelectModel> {
    const accountVerificationRecord = await this.accountVerificationDao.create({
      data: {
        userId: userId,
        code: generate6DigitsCode(),
        expiresAt: new Date(new Date().getTime() + 42200000), // current date + 12 hours (1000 * 60 * 60 * 12)
      },
    });

    await this.mailService.sendEmail({
      to: email,
      subject: 'verification approval',
      html: await this.handlebarsService.render(
        TemplatesEnum.verificationEmail,
        {
          name: username,
          email: email,
          code: accountVerificationRecord.code,
          expiresAt: accountVerificationRecord.expiresAt,
          year: new Date().getFullYear(),
        },
      ),
    });

    return accountVerificationRecord;
  }
}
