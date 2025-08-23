import { Inject, Injectable, Logger } from '@nestjs/common';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import {
  Drizzle,
  DRIZZLE_CONNECTION,
} from '../../4_low/drizzle/drizzle.module';
import { permission } from '../../6_model/db';
import { BaseDao } from './base.dao';

export type PermissionInsertModel = InferInsertModel<typeof permission>;
export type PermissionSelectModel = InferSelectModel<typeof permission>;

@Injectable()
export class PermissionDao extends BaseDao<typeof permission> {
  private readonly logger = new Logger(PermissionDao.name);

  constructor(
    @Inject(DRIZZLE_CONNECTION)
    private readonly postgresDatabase: Drizzle,
  ) {
    super(permission, postgresDatabase, {
      entityName: {
        singular: 'permission',
        plural: 'permission',
      },
    });
  }
}
