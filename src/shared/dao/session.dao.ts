import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  count,
  desc,
  eq,
  type InferInsertModel,
  type InferSelectModel,
} from 'drizzle-orm';

import { Listable } from '../interfaces/abstract.interface';
import { DrizzlePagination } from '../interfaces/db.interface';
import { Drizzle, DRIZZLE_CONNECTION } from '../modules/drizzle/drizzle.module';
import { session } from '../modules/drizzle/schemas';
import { BaseDao } from './base.dao';

export type SessionSelectModel = InferSelectModel<typeof session>;
export type SessionInsertModel = InferInsertModel<typeof session>;

@Injectable()
export class SessionDao extends BaseDao<typeof session> {
  private readonly logger = new Logger(SessionDao.name);

  constructor(
    @Inject(DRIZZLE_CONNECTION)
    private readonly postgresDatabase: Drizzle,
  ) {
    super(session, postgresDatabase, {
      entityName: {
        singular: 'session',
        plural: 'sessions',
      },
    });
  }

  async findManyByUserId({
    userId,
    pagination,
  }: {
    userId: string;
    pagination?: DrizzlePagination;
  }): Promise<SessionSelectModel[]> {
    if (pagination) {
      return await this.postgresDatabase
        .select()
        .from(session)
        .where(eq(session.userId, userId))
        .offset(pagination.offset)
        .limit(pagination.limit)
        .orderBy(desc(session.createdAt));
    }

    return await this.postgresDatabase
      .select()
      .from(session)
      .where(eq(session.userId, userId))
      .orderBy(desc(session.createdAt));
  }

  async countByUserId({ userId }: { userId: string }): Promise<number> {
    const result = await this.postgresDatabase
      .select({ count: count(session.userId) })
      .from(session)
      .where(eq(session.userId, userId));

    return result[0]?.count;
  }

  async listSessionsByUserId({
    userId,
    pagination,
  }: {
    userId: string;
    pagination: DrizzlePagination;
  }): Promise<Listable<SessionSelectModel>> {
    const [items, count] = await Promise.all([
      await this.findManyByUserId({ userId, pagination }),
      await this.countByUserId({ userId }),
    ]);

    return {
      items,
      count,
    };
  }

  async updateSession({
    data,
    id,
  }: {
    data: Partial<SessionInsertModel>;
    id: string;
  }): Promise<SessionSelectModel> {
    const updatedUserId = await this.postgresDatabase
      .update(session)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(session.id, id))
      .returning();

    return updatedUserId[0];
  }

  async getSessionById({ id }: { id: string }): Promise<SessionSelectModel> {
    const [find] = await this.postgresDatabase
      .select()
      .from(session)
      .where(eq(session.id, id));

    if (find === undefined) {
      throw new NotFoundException();
    }

    return find;
  }
}
