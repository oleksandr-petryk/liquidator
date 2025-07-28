import { Injectable } from '@nestjs/common';

import { AccountVerificationDao } from '../../../shared/dao/account-verification.dao';
import { UserDao } from '../../../shared/dao/user.dao';

@Injectable()
export class AccountVerificationService {
  constructor(
    private readonly accountVerificationDao: AccountVerificationDao,
    private readonly userDao: UserDao,
  ) {}

  public async verifyUserAccount(userId: string): Promise<void> {
    await this.accountVerificationDao.canVerifyAccount(userId);

    await this.userDao.update({
      data: { verifyed: true },
      id: userId,
    });
  }
}
