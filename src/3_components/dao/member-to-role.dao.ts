import { Inject, Injectable, Logger } from '@nestjs/common';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import {
  Drizzle,
  DRIZZLE_CONNECTION,
} from '../../4_low/drizzle/drizzle.module';
import { memberToRole } from '../../6_model/db/member-to-role';
import { BaseDao } from './base.dao';
import { MemberSelectModel } from './member.dao';
import { RoleSelectModel } from './role.dao';

export type MemberToRoleInsertModel = InferInsertModel<typeof memberToRole>;
export type MemberToRoleSelectModel = InferSelectModel<typeof memberToRole> & {
  member: MemberSelectModel | null;
  role: RoleSelectModel | null;
};

@Injectable()
export class MemberToRoleDao extends BaseDao<typeof memberToRole> {
  private readonly logger = new Logger(MemberToRoleDao.name);

  constructor(
    @Inject(DRIZZLE_CONNECTION)
    private readonly postgresDatabase: Drizzle,
  ) {
    super(memberToRole, postgresDatabase, {
      entityName: {
        singular: 'member-to-role',
        plural: 'member-to-roles',
      },
    });
  }
}
