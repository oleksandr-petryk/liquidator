import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import type {
  organization,
  passwordResetRequest,
  picture,
  team,
  teamToUser,
  user,
} from '../modules/drizzle/schemas';

export type OrganizationInsertModel = InferInsertModel<typeof organization>;
export type OrganizationSelectModel = InferSelectModel<typeof organization>;

export type PasswordResetRequestInsrtModel = InferInsertModel<
  typeof passwordResetRequest
>;
export type PasswordResetRequestSelectModel = InferSelectModel<
  typeof passwordResetRequest
>;

export type PictureInsertModel = InferInsertModel<typeof picture>;
export type PictureSelectModel = InferSelectModel<typeof picture>;

export type TeamInsertModel = InferInsertModel<typeof team>;
export type TeamSelectModel = InferSelectModel<typeof team>;

export type TeamToUserInsertModel = InferInsertModel<typeof teamToUser>;
export type TeamToUserSelectModel = InferSelectModel<typeof teamToUser>;

export type UserInsertModel = InferInsertModel<typeof user>;
export type UserSelectModel = InferSelectModel<typeof user>;
