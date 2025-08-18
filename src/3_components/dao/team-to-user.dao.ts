import { Inject, Injectable, Logger } from '@nestjs/common';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import {
  Drizzle,
  DRIZZLE_CONNECTION,
} from '../../4_low/drizzle/drizzle.module';
import { teamToUser } from '../../6_model/db';
import { BaseDao } from './base.dao';
import { TeamSelectModel } from './team.dao';
import { UserSelectModel } from './user.dao';

export type TeamToUserInsertModel = InferInsertModel<typeof teamToUser>;
export type TeamToUserSelectModel = InferSelectModel<typeof teamToUser> & {
  user: UserSelectModel | null;
  team: TeamSelectModel | null;
};

@Injectable()
export class TeamToUserDao extends BaseDao<typeof teamToUser> {
  private readonly logger = new Logger(TeamToUserDao.name);

  constructor(
    @Inject(DRIZZLE_CONNECTION)
    private readonly postgresDatabase: Drizzle,
  ) {
    super(teamToUser, postgresDatabase, {
      entityName: {
        singular: 'team-to-user',
        plural: 'team-to-user',
      },
    });
  }
}
