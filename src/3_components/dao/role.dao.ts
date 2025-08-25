import { Inject, Injectable, Logger } from '@nestjs/common';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import {
  Drizzle,
  DRIZZLE_CONNECTION,
} from '../../4_low/drizzle/drizzle.module';
import { role } from '../../6_model/db';
import { BaseDao } from './base.dao';
import { OrganizationSelectModel } from './organization.dao';

export type RoleInsertModel = InferInsertModel<typeof role>;
export type RoleSelectModel = InferSelectModel<typeof role> & {
  organization: OrganizationSelectModel | null;
};

@Injectable()
export class RoleDao extends BaseDao<typeof role> {
  private readonly logger = new Logger(RoleDao.name);

  constructor(
    @Inject(DRIZZLE_CONNECTION)
    private readonly postgresDatabase: Drizzle,
  ) {
    super(role, postgresDatabase, {
      entityName: {
        singular: 'role',
        plural: 'roles',
      },
    });
  }
}
