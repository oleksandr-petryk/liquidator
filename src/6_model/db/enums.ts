import { pgEnum } from 'drizzle-orm/pg-core';

import {
  ActivityLogAction,
  Gender,
  Role,
  SessionStatus,
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

export const activityLogActionEnum = pgEnum(
  'activity_log_action',
  ActivityLogAction,
);

export const SessionStatusEnum = pgEnum('session-status', [
  SessionStatus.Expired,
  SessionStatus.Refreshed,
  SessionStatus.Deleted,
]);
