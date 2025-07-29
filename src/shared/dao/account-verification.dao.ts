import {
  BadRequestException,
  GoneException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { eq, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';

import { Drizzle, DRIZZLE_CONNECTION } from '../modules/drizzle/drizzle.module';
import { user } from '../modules/drizzle/schemas';
import { accountVerification } from '../modules/drizzle/schemas/account-verification';
import { nonNullableUtils } from '../utils/db.util';
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

  private notFound(message?: string): never {
    throw new NotFoundException(message || 'Account verification not found');
  }

  async findByUserId({
    db = this.postgres,
    userId,
  }: {
    db?: Drizzle;
    userId: string;
  }): Promise<AccountVerificationSelectModel> {
    const [find] = await db
      .select()
      .from(accountVerification)
      .where(eq(accountVerification.userId, userId));

    return find;
  }

  public async getByUserId(
    userId: string,
  ): Promise<AccountVerificationSelectModel> {
    const result = await this.findByUserId({ userId });

    return nonNullableUtils(
      result,
      new BadRequestException(
        'Account verification record not found, id: ' + userId,
      ),
    );
  }

  public async canVerifyAccount(userId: string): Promise<void> {
    if ((await this.getByUserId(userId)).expiresAt < new Date()) {
      throw new GoneException('The code has expired');
    }

    if (
      (
        await this.postgres.query.user.findFirst({
          where: eq(user.id, userId),
        })
      )?.verifyed === true
    ) {
      throw new BadRequestException('User is already verified');
    }
  }
}
