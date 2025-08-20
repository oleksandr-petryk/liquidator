import { Module } from '@nestjs/common';

import { AccountVerificationDao } from './account-verification.dao';
import { ActivityLogDao } from './activity-log.dao';
import { ClientFingerprintDao } from './client-fingerprint.dao';
import { OrganizationDao } from './organization.dao';
import { PasswordResetRequestDao } from './password-reset-request.dao';
import { PictureDao } from './pictures.dao';
import { SessionDao } from './session.dao';
import { TeamDao } from './team.dao';
import { TeamToUserDao } from './team-to-user.dao';
import { UserDao } from './user.dao';

@Module({
  providers: [
    AccountVerificationDao,
    ActivityLogDao,
    ClientFingerprintDao,
    OrganizationDao,
    PasswordResetRequestDao,
    PictureDao,
    SessionDao,
    TeamDao,
    TeamToUserDao,
    UserDao,
  ],
  exports: [
    AccountVerificationDao,
    ActivityLogDao,
    ClientFingerprintDao,
    OrganizationDao,
    PasswordResetRequestDao,
    PictureDao,
    SessionDao,
    TeamDao,
    TeamToUserDao,
    UserDao,
  ],
})
export class DaoModule {}
