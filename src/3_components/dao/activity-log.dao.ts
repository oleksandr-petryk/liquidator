import { Inject, Injectable, Logger } from '@nestjs/common';
import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';

import {
  Drizzle,
  DRIZZLE_CONNECTION,
} from '../../4_low/drizzle/drizzle.module';
import { activityLog } from '../../6_model/db/activity-log';
import { BaseDao } from './base.dao';

export type ActivityLogInsertModel = InferInsertModel<typeof activityLog>;
export type ActivityLogSelectModel = InferSelectModel<typeof activityLog>;

@Injectable()
export class ActivityLogDao extends BaseDao<typeof activityLog> {
  private readonly logger = new Logger(ActivityLogDao.name);

  constructor(
    @Inject(DRIZZLE_CONNECTION)
    private readonly postgresDatabase: Drizzle,
  ) {
    super(activityLog, postgresDatabase, {
      entityName: {
        singular: 'activity-log',
        plural: 'activity-log',
      },
    });
  }
}
