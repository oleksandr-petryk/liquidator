import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import type {
  organization,
  passwordResetRequest,
  picture,
  session,
  team,
  teamToUser,
  user,
} from '../modules/drizzle/schemas';

export type OrganizationInsertModel = InferInsertModel<typeof organization>;
export type OrganizationSelectModel = InferSelectModel<typeof organization> & {
  picture: PictureSelectModel | null;
};

export type PasswordResetRequestInsertModel = InferInsertModel<
  typeof passwordResetRequest
>;
export type PasswordResetRequestSelectModel = InferSelectModel<
  typeof passwordResetRequest
> & {
  user: UserSelectModel | null;
};

export type PictureInsertModel = InferInsertModel<typeof picture>;
export type PictureSelectModel = InferSelectModel<typeof picture>;

export type SessionInsertModel = InferInsertModel<typeof session>;
export type SessionSelectModel = InferSelectModel<typeof session> & {
  user: UserSelectModel | null;
};

export type TeamInsertModel = InferInsertModel<typeof team>;
export type TeamSelectModel = InferSelectModel<typeof team> & {
  picture: PictureSelectModel | null;
  teamToUser: Array<TeamToUserSelectModel> | null;
};

export type TeamToUserInsertModel = InferInsertModel<typeof teamToUser>;
export type TeamToUserSelectModel = InferSelectModel<typeof teamToUser> & {
  user: UserSelectModel | null;
  team: TeamSelectModel | null;
};

export type UserInsertModel = InferInsertModel<typeof user>;
export type UserSelectModel = InferSelectModel<typeof user> & {
  picture?: PictureSelectModel | null;
  passwordResetRequest?: Array<PasswordResetRequestSelectModel> | null;
  session?: Array<SessionSelectModel> | null;
  teamToUser?: Array<TeamToUserSelectModel> | null;
};
