import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { QueryResult } from 'pg';

import { Drizzle, DRIZZLE_CONNECTION } from '../modules/drizzle/drizzle.module';
import { user } from '../modules/drizzle/schemas';
import { BaseDao } from './base.dto';

type userClass = {
  id: string;
  status: string | null;
  email: string;
  phoneNumber: string;
  username: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string | null;
  pictureId: number | null;
  recoveryEmailAddress: string;
  createdAt: Date;
  updatedAt: Date | null;
}; // its temporarily

@Injectable()
export class UserDao extends BaseDao<typeof user> {
  constructor(
    @Inject(DRIZZLE_CONNECTION)
    private readonly postgresDatabase: Drizzle,
  ) {
    super(user, postgresDatabase, {
      entityName: {
        singular: 'contact',
        plural: 'contacts',
      },
    });
  }

  private notFound(message?: string): never {
    throw new NotFoundException(message || 'Contact found');
  }

  async findById({
    db = this.postgresDatabase,
    id,
  }: {
    db?: Drizzle;
    id?: any;
  } = {}): Promise<userClass | undefined> {
    try {
      const user = await db.query.user.findFirst({ where: id });

      return user;
    } catch (error) {
      this.logger.error(
        `Could not find ${this.options.entityName.plural}: ${error}`,
      );
      throw error;
    }
  }

  async createUser({
    db = this.postgresDatabase,
    value,
  }: {
    db?: Drizzle;
    value?: any;
  } = {}): Promise<userClass[]> {
    try {
      const createdUser = await db.insert(user).values(value).returning();
      return createdUser;
    } catch (error) {
      this.logger.error(
        `Could not created ${this.options.entityName.plural}: ${error}`,
      );
      throw error;
    }
  }

  async updateById({
    db = this.postgresDatabase,
    value,
    id,
  }: {
    db?: Drizzle;
    value?: any;
    id?: any;
  } = {}): Promise<QueryResult<never>> {
    try {
      const updatedUser = await db
        .update(user)
        .set(value)
        .where(eq(user.id, id));
      return updatedUser;
    } catch (error) {
      this.logger.error(
        `Could not updated ${this.options.entityName.plural}: ${error}`,
      );
      throw error;
    }
  }

  async deleteById({
    db = this.postgresDatabase,
    id,
  }: {
    db?: Drizzle;
    id?: any;
  } = {}): Promise<QueryResult<never>> {
    try {
      const deletedUser = await db.delete(user).where(eq(user.id, id));
      return deletedUser;
    } catch (error) {
      this.logger.error(
        `Could not deleted ${this.options.entityName.plural}: ${error}`,
      );
      throw error;
    }
  }
}
