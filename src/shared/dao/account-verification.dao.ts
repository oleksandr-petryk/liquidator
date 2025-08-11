import { Inject, Injectable, Logger } from '@nestjs/common';
import { eq, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { desc } from 'drizzle-orm';

import { Drizzle, DRIZZLE_CONNECTION } from '../modules/drizzle/drizzle.module';
import { accountVerification } from '../modules/drizzle/schemas/account-verification';
import { BaseDao } from './base.dao';

export type AccountVerificationInsertModel = InferInsertModel<
  typeof accountVerification
>;
export type AccountVerificationSelectModel = InferSelectModel<
  typeof accountVerification
>;

@Injectable()
export class AccountVerificationDao extends BaseDao<
  typeof accountVerification
> {
  private readonly logger = new Logger(AccountVerificationDao.name);

  constructor(
    @Inject(DRIZZLE_CONNECTION)
    private readonly postgresDatabase: Drizzle,
  ) {
    super(accountVerification, postgresDatabase, {
      entityName: {
        singular: 'account-verification',
        plural: 'account-verification',
      },
    });
  }

  async findByUserId({
    db = this.postgres,
    userId,
  }: {
    db?: Drizzle;
    userId: string;
  }): Promise<AccountVerificationSelectModel> {
    const [result] = await db
      .select()
      .from(accountVerification)
      .where(eq(accountVerification.userId, userId))
      .orderBy(desc(accountVerification.createdAt))
      .limit(1);

    return result;
  }
}
