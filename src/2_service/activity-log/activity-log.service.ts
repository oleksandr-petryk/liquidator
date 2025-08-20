import { Injectable } from '@nestjs/common';

import { ActivityLogDao } from '../../3_components/dao/activity-log.dao';
import { ActivityLogAction } from '../../5_shared/enums/db.enum';

@Injectable()
export class ActivityLogService {
  constructor(private readonly activityLogDao: ActivityLogDao) {}

  async createLog_Registration({ userId }: { userId: string }): Promise<void> {
    await this.activityLogDao.create({
      data: {
        userId,
        actions: ActivityLogAction.Registration,
        secretContext: {},
        context: {},
      },
    });
  }

  async createLog_Login({
    userId,
    clientFingerprintId,
  }: {
    userId: string;
    clientFingerprintId: string;
  }): Promise<void> {
    await this.activityLogDao.create({
      data: {
        userId,
        actions: ActivityLogAction.Login,
        secretContext: {},
        context: {},
        clientFingerprintId,
      },
    });
  }

  async createLog_LoginFailedWithInvalidPassword({
    userId,
  }: {
    userId: string;
  }): Promise<void> {
    await this.activityLogDao.create({
      data: {
        userId,
        actions: ActivityLogAction.LoginFailedWithInvalidPassword,
        secretContext: {},
        context: {},
      },
    });
  }

  async createLog_RefreshTokens({
    userId,
    clientFingerprintId,
  }: {
    userId: string;
    clientFingerprintId: string;
  }): Promise<void> {
    await this.activityLogDao.create({
      data: {
        userId,
        actions: ActivityLogAction.RefreshTokens,
        secretContext: {},
        context: {},
        clientFingerprintId,
      },
    });
  }

  async createLog_RefreshTokensFailedWithExpiredRefreshToken({
    userId,
    clientFingerprintId,
  }: {
    userId: string;
    clientFingerprintId: string;
  }): Promise<void> {
    await this.activityLogDao.create({
      data: {
        userId,
        actions: ActivityLogAction.RefreshTokensFailedWithExpiredRefreshToken,
        secretContext: {},
        context: {},
        clientFingerprintId,
      },
    });
  }

  async createLog_RefreshFailedWithOldRefreshToken({
    userId,
    clientFingerprintId,
  }: {
    userId: string;
    clientFingerprintId: string;
  }): Promise<void> {
    await this.activityLogDao.create({
      data: {
        userId,
        actions: ActivityLogAction.RefreshFailedWithOldRefreshToken,
        secretContext: {},
        context: {},
        clientFingerprintId,
      },
    });
  }

  async createLog_AccountVerification({
    userId,
    clientFingerprintId,
  }: {
    userId: string;
    clientFingerprintId: string;
  }): Promise<void> {
    await this.activityLogDao.create({
      data: {
        userId,
        actions: ActivityLogAction.AccountVerification,
        secretContext: {},
        context: {},
        clientFingerprintId,
      },
    });
  }

  async createLog_AccountVerificationFailedWithWrongCode({
    userId,
    clientFingerprintId,
  }: {
    userId: string;
    clientFingerprintId: string;
  }): Promise<void> {
    await this.activityLogDao.create({
      data: {
        userId,
        actions: ActivityLogAction.AccountVerificationFailedWithWrongCode,
        secretContext: {},
        context: {},
        clientFingerprintId,
      },
    });
  }

  async createLog_UpdateSessionName({
    userId,
    clientFingerprintId,
  }: {
    userId: string;
    clientFingerprintId: string;
  }): Promise<void> {
    await this.activityLogDao.create({
      data: {
        userId,
        actions: ActivityLogAction.UpdateSessionName,
        secretContext: {},
        context: {},
        clientFingerprintId,
      },
    });
  }

  async createLog_DeleteSession({
    userId,
    clientFingerprintId,
  }: {
    userId: string;
    clientFingerprintId: string;
  }): Promise<void> {
    await this.activityLogDao.create({
      data: {
        userId,
        actions: ActivityLogAction.DeleteSession,
        secretContext: {},
        context: {},
        clientFingerprintId,
      },
    });
  }

  async createLog_SendPasswordResetEmail({
    userId,
  }: {
    userId: string;
  }): Promise<void> {
    await this.activityLogDao.create({
      data: {
        userId,
        actions: ActivityLogAction.SendPasswordResetEmail,
        secretContext: {},
        context: {},
      },
    });
  }

  async createLog_SendPasswordResetEmailFailedReachedLimit({
    userId,
  }: {
    userId: string;
  }): Promise<void> {
    await this.activityLogDao.create({
      data: {
        userId,
        actions: ActivityLogAction.SendPasswordResetEmailFailedReachedLimit,
        secretContext: {},
        context: {},
      },
    });
  }

  async createLog_ResetPassword({
    userId,
    clientFingerprintId,
  }: {
    userId: string;
    clientFingerprintId: string;
  }): Promise<void> {
    await this.activityLogDao.create({
      data: {
        userId,
        actions: ActivityLogAction.ResetPassword,
        secretContext: {},
        context: {},
        clientFingerprintId,
      },
    });
  }

  async createLog_ResetPasswordFailedWithWrongCode({
    userId,
    clientFingerprintId,
  }: {
    userId: string;
    clientFingerprintId: string;
  }): Promise<void> {
    await this.activityLogDao.create({
      data: {
        userId,
        actions: ActivityLogAction.ResetPasswordFailedWithWrongCode,
        secretContext: {},
        context: {},
        clientFingerprintId,
      },
    });
  }

  async createLog_ChangePassword({
    userId,
    clientFingerprintId,
  }: {
    userId: string;
    clientFingerprintId: string;
  }): Promise<void> {
    await this.activityLogDao.create({
      data: {
        userId,
        actions: ActivityLogAction.ChangePassword,
        secretContext: {},
        context: {},
        clientFingerprintId,
      },
    });
  }

  async createLog_ChangePasswordFailedWithWrongOldPassword({
    userId,
    clientFingerprintId,
  }: {
    userId: string;
    clientFingerprintId: string;
  }): Promise<void> {
    await this.activityLogDao.create({
      data: {
        userId,
        actions: ActivityLogAction.ChangePasswordFailedWithWrongOldPassword,
        secretContext: {},
        context: {},
        clientFingerprintId,
      },
    });
  }
}
