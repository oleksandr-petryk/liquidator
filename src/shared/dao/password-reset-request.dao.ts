import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import { Drizzle, DRIZZLE_CONNECTION } from '../modules/drizzle/drizzle.module';
import { passwordResetRequest } from '../modules/drizzle/schemas';
import { BaseDao } from './base.dao';
import { UserSelectModel } from './user.dao';

export type PasswordResetRequestInsertModel = InferInsertModel<
  typeof passwordResetRequest
>;
export type PasswordResetRequestSelectModel = InferSelectModel<
  typeof passwordResetRequest
> & {
  user: UserSelectModel | null;
};

@Injectable()
export class PasswordResetRequestDao extends BaseDao<
  typeof passwordResetRequest
> {
  private readonly logger = new Logger(PasswordResetRequestDao.name);

  constructor(
    @Inject(DRIZZLE_CONNECTION)
    private readonly postgresDatabase: Drizzle,
  ) {
    super(passwordResetRequest, postgresDatabase, {
      entityName: {
        singular: 'password-reset-request',
        plural: 'password-reset-request',
      },
    });
  }

  private notFound(message?: string): never {
    throw new NotFoundException(message || 'Password reset request not found');
  }
}
