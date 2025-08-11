import { Inject, Injectable, Logger } from '@nestjs/common';
import { eq, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';

import { Drizzle, DRIZZLE_CONNECTION } from '../modules/drizzle/drizzle.module';
import { user } from '../modules/drizzle/schemas';
import { BaseDao } from './base.dao';
import { PasswordResetRequestSelectModel } from './password-reset-request.dao';
import { PictureSelectModel } from './pictures.dao';
import { TeamToUserSelectModel } from './team-to-user.dao';

export type UserInsertModel = InferInsertModel<typeof user>;
export type UserSelectModel = InferSelectModel<typeof user> & {
  picture?: PictureSelectModel | null;
  passwordResetRequest?: Array<PasswordResetRequestSelectModel> | null;
  teamToUser?: Array<TeamToUserSelectModel> | null;
};

@Injectable()
export class UserDao extends BaseDao<typeof user> {
  private readonly logger = new Logger(UserDao.name);

  constructor(
    @Inject(DRIZZLE_CONNECTION)
    private readonly postgresDatabase: Drizzle,
  ) {
    super(user, postgresDatabase, {
      entityName: {
        singular: 'user',
        plural: 'user',
      },
    });
  }

  async findManyByPictureId({
    db = this.postgresDatabase,
    pictureId,
  }: {
    db?: Drizzle;
    pictureId: string;
  }): Promise<UserSelectModel[]> {
    const find = await db
      .select()
      .from(user)
      .where(eq(user.pictureId, pictureId));

    return find;
  }

  public async findByEmail({
    db = this.postgresDatabase,
    email,
  }: {
    db?: Drizzle;
    email: string;
  }): Promise<UserSelectModel | undefined> {
    try {
      const result = await db.select().from(user).where(eq(user.email, email));

      return result[0];
    } catch (error) {
      this.logger.error(`An error occurred when trying to findByEmail`);
      throw error;
    }
  }

  public async findByUsername({
    db = this.postgresDatabase,
    username,
  }: {
    db?: Drizzle;
    username: string;
  }): Promise<UserSelectModel | undefined> {
    try {
      const result = await db
        .select()
        .from(user)
        .where(eq(user.username, username));

      return result[0];
    } catch (error) {
      this.logger.error(`An error occurred when trying to findByUsername`);
      throw error;
    }
  }

  public async findByPhoneNumber({
    db = this.postgresDatabase,
    phoneNumber,
  }: {
    db?: Drizzle;
    phoneNumber: string;
  }): Promise<UserSelectModel | undefined> {
    try {
      const find = await db.query.user.findFirst({
        where: eq(user.phoneNumber, phoneNumber),
      });

      return find as UserSelectModel;
    } catch (error) {
      this.logger.error(`An error occurred when trying to findByPhoneNumber`);
      throw error;
    }
  }
}
