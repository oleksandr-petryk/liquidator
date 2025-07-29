import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { eq, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';

import { Drizzle, DRIZZLE_CONNECTION } from '../modules/drizzle/drizzle.module';
import { user } from '../modules/drizzle/schemas';
import { nonNullableUtils } from '../utils/db.util';
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

  public async getByEmail({
    db = this.postgresDatabase,
    email,
  }: {
    db?: Drizzle;
    email: string;
  }): Promise<UserSelectModel> {
    const result = await this.findByEmail({ db, email });

    return nonNullableUtils(
      result,
      new BadRequestException('User not found, email: ' + email),
    );
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

  public async getByUsername({
    db = this.postgresDatabase,
    username,
  }: {
    db?: Drizzle;
    username: string;
  }): Promise<UserSelectModel> {
    const result = await this.findByUsername({ db, username });

    return nonNullableUtils(
      result,
      new BadRequestException('User not found, username: ' + username),
    );
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

  public async getByPhoneNumber({
    db = this.postgresDatabase,
    phoneNumber,
  }: {
    db?: Drizzle;
    phoneNumber: string;
  }): Promise<UserSelectModel> {
    const result = await this.findByPhoneNumber({ db, phoneNumber });

    return nonNullableUtils(
      result,
      new BadRequestException('User not found, phoneNumber: ' + phoneNumber),
    );
  }

  public async getById({
    db = this.postgresDatabase,
    id,
  }: {
    db?: Drizzle;
    id: string;
  }): Promise<UserSelectModel> {
    const result = await this.findById({ db, id });

    return nonNullableUtils(
      result,
      new BadRequestException('User not found, id: ' + id),
    );
  }
}
