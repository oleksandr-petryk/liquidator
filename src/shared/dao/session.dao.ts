import { Inject, Injectable, Logger } from '@nestjs/common';
import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';

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

  async listSessionsByUserId(): Promise<Listable<SessionSelectModel>> {
    //   TODO: return pageable or listable sessions
  }
}
