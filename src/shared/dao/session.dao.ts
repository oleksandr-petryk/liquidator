import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  count,
  eq,
  type InferInsertModel,
  type InferSelectModel,
} from 'drizzle-orm';

import { Listable } from '../interfaces/abstract.interface';
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

  // TODO:...
  async findManyByUserId({
    userId,
  }: {
    userId: string;
  }): Promise<SessionSelectModel[]> {
    return await this.postgresDatabase
      .select()
      .from(session)
      .where(eq(session.userId, userId));
  }

  // TODO:...
  async countByUserId({ userId }: { userId: string }): Promise<number> {
    const result = await this.postgresDatabase
      .select({ count: count(session.userId) })
      .from(session)
      .where(eq(session.userId, userId));

    return result[0]?.count;
  }

  async listSessionsByUserId({
    userId,
  }: {
    userId: string;
  }): Promise<Listable<SessionSelectModel>> {
    const [items, count] = await Promise.all([
      await this.findManyByUserId({ userId }),
      await this.countByUserId({ userId }),
    ]);

    return {
      items,
      count,
    };
  }
}
