import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { Drizzle, DRIZZLE_CONNECTION } from '../modules/drizzle/drizzle.module';
import { user } from '../modules/drizzle/schemas';
import type { UserSelectModel } from '../types/db.type';
import { BaseDao } from './base.dto';

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

  private notFound(message?: string): never {
    throw new NotFoundException(message || 'User not found');
  }

  public async findByEmail({
    db = this.postgres,
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
    db = this.postgres,
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
    db = this.postgres,
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
