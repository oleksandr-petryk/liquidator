export enum Status {
  Published = 'published',
  Draft = 'draft',
  Archived = 'archived',
}

export enum Gender {
  Male = 'male',
  Female = 'female',
}

export enum Role {
  Member = 'member',
  Admin = 'admin',
  Owner = 'owner',
}

export enum ActivityLogAction {
  Registration = 'registration',
  Login = 'login',
  LoginFailedWithInvalidPassword = 'loginFailedWithInvalidPassword',
  RefreshTokens = 'refreshTokens',
  RefreshTokensFailedWithExpiredRefreshToken = 'refreshTokensFailedWithExpiredRefreshToken',
  RefreshFailedWithOldRefreshToken = 'refreshFailedWithOldRefreshToken',
  AccountVerification = 'accountVerification',
  AccountVerificationFailedWithWrongCode = 'accountVerificationFailedWithWrongCode',
  UpdateSessionName = 'updateSessionName',
  DeleteSession = 'deleteSession',
  SendPasswordResetEmail = 'sendPasswordResetEmail',
  SendPasswordResetEmailFailedReachedLimit = 'sendPasswordResetEmailFailedReachedLimit',
  ResetPassword = 'resetPassword',
  ResetPasswordFailedWithWrongCode = 'resetPasswordFailedWithWrongCode',
  ChangePassword = 'changePassword',
  ChangePasswordFailedWithWrongOldPassword = 'changePasswordFailedWithWrongOldPassword',
}
