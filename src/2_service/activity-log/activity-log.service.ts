import { Injectable } from '@nestjs/common';

import {
  ActivityLogDao,
  ActivityLogSelectModel,
} from '../../3_components/dao/activity-log.dao';
import { ActivityLogAction } from '../../5_shared/enums/db.enum';

type CreateActivityLogDefaultOptions = Pick<
  ActivityLogSelectModel,
  'userId' | 'clientFingerprintId'
>;

@Injectable()
export class ActivityLogService {
  constructor(private readonly activityLogDao: ActivityLogDao) {}

  async createLog_Registration({
    userId,
    clientFingerprintId,
  }: CreateActivityLogDefaultOptions): Promise<void> {
    await this.activityLogDao.create({
      data: {
        userId,
        action: ActivityLogAction.Registration,
        secretContext: {},
        context: {},
        clientFingerprintId,
      },
    });
  }

  async createLog_Login({
    userId,
    clientFingerprintId,
  }: CreateActivityLogDefaultOptions): Promise<void> {
    await this.activityLogDao.create({
      data: {
        userId,
        action: ActivityLogAction.Login,
        secretContext: {},
        context: {},
        clientFingerprintId,
      },
    });
  }

  async createLog_LoginFailedWithInvalidPassword({
    userId,
    clientFingerprintId,
  }: CreateActivityLogDefaultOptions): Promise<void> {
    await this.activityLogDao.create({
      data: {
        userId,
        action: ActivityLogAction.LoginFailedWithInvalidPassword,
        secretContext: {},
        context: {},
        clientFingerprintId,
      },
    });
  }

  async createLog_RefreshTokens({
    userId,
    clientFingerprintId,
  }: CreateActivityLogDefaultOptions): Promise<void> {
    await this.activityLogDao.create({
      data: {
        userId,
        action: ActivityLogAction.RefreshTokens,
        secretContext: {},
        context: {},
        clientFingerprintId,
      },
    });
  }

  async createLog_RefreshTokensFailedWithExpiredRefreshToken({
    userId,
    clientFingerprintId,
  }: CreateActivityLogDefaultOptions): Promise<void> {
    await this.activityLogDao.create({
      data: {
        userId,
        action: ActivityLogAction.RefreshTokensFailedWithExpiredRefreshToken,
        secretContext: {},
        context: {},
        clientFingerprintId,
      },
    });
  }

  async createLog_RefreshFailedWithOldRefreshToken({
    userId,
    clientFingerprintId,
  }: CreateActivityLogDefaultOptions): Promise<void> {
    await this.activityLogDao.create({
      data: {
        userId,
        action: ActivityLogAction.RefreshFailedWithOldRefreshToken,
        secretContext: {},
        context: {},
        clientFingerprintId,
      },
    });
  }

  async createLog_AccountVerification({
    userId,
    clientFingerprintId,
  }: CreateActivityLogDefaultOptions): Promise<void> {
    await this.activityLogDao.create({
      data: {
        userId,
        action: ActivityLogAction.AccountVerification,
        secretContext: {},
        context: {},
        clientFingerprintId,
      },
    });
  }

  async createLog_AccountVerificationFailedWithWrongCode({
    userId,
    clientFingerprintId,
  }: CreateActivityLogDefaultOptions): Promise<void> {
    await this.activityLogDao.create({
      data: {
        userId,
        action: ActivityLogAction.AccountVerificationFailedWithWrongCode,
        secretContext: {},
        context: {},
        clientFingerprintId,
      },
    });
  }

  async createLog_UpdateSessionName({
    userId,
    clientFingerprintId,
  }: CreateActivityLogDefaultOptions): Promise<void> {
    await this.activityLogDao.create({
      data: {
        userId,
        action: ActivityLogAction.UpdateSessionName,
        secretContext: {},
        context: {},
        clientFingerprintId,
      },
    });
  }

  async createLog_DeleteSession({
    userId,
    clientFingerprintId,
  }: CreateActivityLogDefaultOptions): Promise<void> {
    await this.activityLogDao.create({
      data: {
        userId,
        action: ActivityLogAction.DeleteSession,
        secretContext: {},
        context: {},
        clientFingerprintId,
      },
    });
  }

  async createLog_SendPasswordResetEmail({
    userId,
    clientFingerprintId,
  }: CreateActivityLogDefaultOptions): Promise<void> {
    await this.activityLogDao.create({
      data: {
        userId,
        action: ActivityLogAction.SendPasswordResetEmail,
        secretContext: {},
        context: {},
        clientFingerprintId,
      },
    });
  }

  async createLog_SendPasswordResetEmailFailedReachedLimit({
    userId,
    clientFingerprintId,
  }: CreateActivityLogDefaultOptions): Promise<void> {
    await this.activityLogDao.create({
      data: {
        userId,
        action: ActivityLogAction.SendPasswordResetEmailFailedReachedLimit,
        secretContext: {},
        context: {},
        clientFingerprintId,
      },
    });
  }

  async createLog_ResetPassword({
    userId,
    clientFingerprintId,
  }: CreateActivityLogDefaultOptions): Promise<void> {
    await this.activityLogDao.create({
      data: {
        userId,
        action: ActivityLogAction.ResetPassword,
        secretContext: {},
        context: {},
        clientFingerprintId,
      },
    });
  }

  async createLog_ResetPasswordFailedWithWrongCode({
    userId,
    clientFingerprintId,
  }: CreateActivityLogDefaultOptions): Promise<void> {
    await this.activityLogDao.create({
      data: {
        userId,
        action: ActivityLogAction.ResetPasswordFailedWithWrongCode,
        secretContext: {},
        context: {},
        clientFingerprintId,
      },
    });
  }

  async createLog_ChangePassword({
    userId,
    clientFingerprintId,
  }: CreateActivityLogDefaultOptions): Promise<void> {
    await this.activityLogDao.create({
      data: {
        userId,
        action: ActivityLogAction.ChangePassword,
        secretContext: {},
        context: {},
        clientFingerprintId,
      },
    });
  }

  async createLog_ChangePasswordFailedWithWrongOldPassword({
    userId,
    clientFingerprintId,
  }: CreateActivityLogDefaultOptions): Promise<void> {
    await this.activityLogDao.create({
      data: {
        userId,
        action: ActivityLogAction.ChangePasswordFailedWithWrongOldPassword,
        secretContext: {},
        context: {},
        clientFingerprintId,
      },
    });
  }
}
