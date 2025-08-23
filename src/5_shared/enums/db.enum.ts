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
  LoginFailedWithInvalidPassword = 'login_failed_with_invalid_password',
  RefreshTokens = 'refresh_tokens',
  RefreshTokensFailedWithExpiredRefreshToken = 'refresh_tokens_failed_with_expired_refresh_token',
  RefreshFailedWithOldRefreshToken = 'refresh_failed_with_old_refresh_token',
  AccountVerification = 'account_verification',
  AccountVerificationFailedWithWrongCode = 'account_verification_failed_with_wrong_code',
  UpdateSessionName = 'update_session_name',
  DeleteSession = 'delete_session',
  SendPasswordResetEmail = 'send_password_reset_email',
  SendPasswordResetEmailFailedReachedLimit = 'send_password_reset_email_failed_reached_limit',
  ResetPassword = 'reset_password',
  ResetPasswordFailedWithWrongCode = 'reset_password_failed_with_wrong_code',
  ChangePassword = 'change_password',
  ChangePasswordFailedWithWrongOldPassword = 'change_password_failed_with_wrong_old_password',
}

export enum SessionStatus {
  Expired = 'expired',
  Refreshed = 'refreshed',
  Deleted = 'deleted',
}
