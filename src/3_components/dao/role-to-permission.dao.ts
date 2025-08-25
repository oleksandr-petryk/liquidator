import { Inject, Injectable, Logger } from '@nestjs/common';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import {
  Drizzle,
  DRIZZLE_CONNECTION,
} from '../../4_low/drizzle/drizzle.module';
import { roleToPermission } from '../../6_model/db';
import { BaseDao } from './base.dao';
import { PermissionSelectModel } from './permission.dao';
import { RoleSelectModel } from './role.dao';

export type RoleToPermissionInsertModel = InferInsertModel<
  typeof roleToPermission
>;
export type RoleToPermissionSelectModel = InferSelectModel<
  typeof roleToPermission
> & {
  role: RoleSelectModel | null;
  permission: PermissionSelectModel | null;
};

@Injectable()
export class RoleToPermissionDao extends BaseDao<typeof roleToPermission> {
  private readonly logger = new Logger(RoleToPermissionDao.name);

  constructor(
    @Inject(DRIZZLE_CONNECTION)
    private readonly postgresDatabase: Drizzle,
  ) {
    super(roleToPermission, postgresDatabase, {
      entityName: {
        singular: 'role-to-permission',
        plural: 'role-to-permissions',
      },
    });
  }
}
