import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  desc,
  eq,
  type InferInsertModel,
  type InferSelectModel,
} from 'drizzle-orm';

import {
  Drizzle,
  DRIZZLE_CONNECTION,
} from '../../4_low/drizzle/drizzle.module';
import { passwordResetRequest } from '../../6_model/db';
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

  async findByUserId({
    db = this.postgres,
    userId,
  }: {
    db?: Drizzle;
    userId: string;
  }): Promise<Omit<PasswordResetRequestSelectModel, 'user'>> {
    const [result] = await db
      .select()
      .from(passwordResetRequest)
      .where(eq(passwordResetRequest.userId, userId))
      .orderBy(desc(passwordResetRequest.createdAt))
      .limit(1);

    return result;
  }

  async findManyByUserId({
    db = this.postgres,
    userId,
  }: {
    db?: Drizzle;
    userId: string;
  }): Promise<Omit<PasswordResetRequestSelectModel, 'user'>[]> {
    const result = await db
      .select()
      .from(passwordResetRequest)
      .where(eq(passwordResetRequest.userId, userId));

    return result;
  }
}
