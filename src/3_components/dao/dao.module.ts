import { Module } from '@nestjs/common';

import { AccountVerificationDao } from './account-verification.dao';
import { ActivityLogDao } from './activity-log.dao';
import { ClientFingerprintDao } from './client-fingerprint.dao';
import { MemberDao } from './member.dao';
import { OrganizationDao } from './organization.dao';
import { PasswordResetRequestDao } from './password-reset-request.dao';
import { PermissionDao } from './permission.dao';
import { PictureDao } from './pictures.dao';
import { RoleDao } from './role.dao';
import { RoleToPermissionDao } from './role-to-permission.dao';
import { SessionDao } from './session.dao';
import { TeamDao } from './team.dao';
import { TeamToUserDao } from './team-to-user.dao';
import { UserDao } from './user.dao';

@Module({
  providers: [
    AccountVerificationDao,
    ActivityLogDao,
    ClientFingerprintDao,
    MemberDao,
    OrganizationDao,
    PasswordResetRequestDao,
    PermissionDao,
    PictureDao,
    RoleDao,
    RoleToPermissionDao,
    SessionDao,
    TeamDao,
    TeamToUserDao,
    UserDao,
  ],
  exports: [
    AccountVerificationDao,
    ActivityLogDao,
    ClientFingerprintDao,
    MemberDao,
    OrganizationDao,
    PasswordResetRequestDao,
    PermissionDao,
    PictureDao,
    RoleDao,
    RoleToPermissionDao,
    SessionDao,
    TeamDao,
    TeamToUserDao,
    UserDao,
  ],
})
export class DaoModule {}
