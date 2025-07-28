import { Module } from '@nestjs/common';

import { AccountVerificationDao } from '../../shared/dao/account-verification.dao';
import { UserDao } from '../../shared/dao/user.dao';
import { AccountVerificationService } from './services/accountVerification.service';

@Module({
  providers: [AccountVerificationService, AccountVerificationDao, UserDao],
  exports: [AccountVerificationService],
})
export class AccountVerificationModule {}
