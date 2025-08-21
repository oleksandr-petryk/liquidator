import { pgEnum } from 'drizzle-orm/pg-core';

import {
  ActivityLogAction,
  Gender,
  Role,
  Status,
} from '../../5_shared/enums/db.enum';

export const StatusEnum = pgEnum('publish_status', [
  Status.Published,
  Status.Draft,
  Status.Archived,
]);

export const GenderEnum = pgEnum('user_genders', [Gender.Male, Gender.Female]);

export const RoleEnum = pgEnum('user_roles', [
  Role.Member,
  Role.Admin,
  Role.Owner,
]);

export const ActivityLogActionEnum = pgEnum('activity_log_action', [
  ActivityLogAction.Registration,
  ActivityLogAction.Login,
  ActivityLogAction.LoginFailedWithInvalidPassword,
  ActivityLogAction.RefreshTokens,
  ActivityLogAction.RefreshTokensFailedWithExpiredRefreshToken,
  ActivityLogAction.RefreshFailedWithOldRefreshToken,
  ActivityLogAction.AccountVerification,
  ActivityLogAction.AccountVerificationFailedWithWrongCode,
  ActivityLogAction.UpdateSessionName,
  ActivityLogAction.DeleteSession,
  ActivityLogAction.SendPasswordResetEmail,
  ActivityLogAction.SendPasswordResetEmailFailedReachedLimit,
  ActivityLogAction.ResetPassword,
  ActivityLogAction.ResetPasswordFailedWithWrongCode,
  ActivityLogAction.ChangePassword,
  ActivityLogAction.ChangePasswordFailedWithWrongOldPassword,
]);
