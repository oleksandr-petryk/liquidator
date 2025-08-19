import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  count,
  desc,
  eq,
  type InferInsertModel,
  type InferSelectModel,
} from 'drizzle-orm';

import {
  Drizzle,
  DRIZZLE_CONNECTION,
} from '../../4_low/drizzle/drizzle.module';
import { Listable } from '../../5_shared/interfaces/abstract.interface';
import { DrizzlePagination } from '../../5_shared/interfaces/db.interface';
import { session } from '../../6_model/db';
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

  async findByUserId({
    userId,
  }: {
    userId: string;
  }): Promise<SessionSelectModel[]> {
    return await this.postgresDatabase
      .select()
      .from(session)
      .where(eq(session.userId, userId))
      .orderBy(desc(session.createdAt))
      .limit(1);
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
    const [updatedSession] = await this.postgresDatabase
      .update(session)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(session.id, id))
      .returning();

    return updatedSession;
  }
}
