import { Inject, Injectable, Logger } from '@nestjs/common';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import {
  Drizzle,
  DRIZZLE_CONNECTION,
} from '../../4_low/drizzle/drizzle.module';
import { member } from '../../6_model/db';
import { BaseDao } from './base.dao';
import { OrganizationSelectModel } from './organization.dao';
import { RoleSelectModel } from './role.dao';
import { UserSelectModel } from './user.dao';

export type MemberInsertModel = InferInsertModel<typeof member>;
export type MemberSelectModel = InferSelectModel<typeof member> & {
  user: UserSelectModel | null;
  organization: OrganizationSelectModel | null;
  role: RoleSelectModel | null;
};

@Injectable()
export class MemberDao extends BaseDao<typeof member> {
  private readonly logger = new Logger(MemberDao.name);

  constructor(
    @Inject(DRIZZLE_CONNECTION)
    private readonly postgresDatabase: Drizzle,
  ) {
    super(member, postgresDatabase, {
      entityName: {
        singular: 'member',
        plural: 'members',
      },
    });
  }
}
