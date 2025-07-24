import { Inject, Injectable, Logger } from '@nestjs/common';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import { Drizzle, DRIZZLE_CONNECTION } from '../modules/drizzle/drizzle.module';
import { team } from '../modules/drizzle/schemas';
import { BaseDao } from './base.dao';
import { PictureSelectModel } from './pictures.dao';
import { TeamToUserSelectModel } from './team-to-user.dao';

export type TeamInsertModel = InferInsertModel<typeof team>;
export type TeamSelectModel = InferSelectModel<typeof team> & {
  picture: PictureSelectModel | null;
  teamToUser: Array<TeamToUserSelectModel> | null;
};

@Injectable()
export class TeamDao extends BaseDao<typeof team> {
  private readonly logger = new Logger(TeamDao.name);

  constructor(
    @Inject(DRIZZLE_CONNECTION)
    private readonly postgresDatabase: Drizzle,
  ) {
    super(team, postgresDatabase, {
      entityName: {
        singular: 'team',
        plural: 'team',
      },
    });
  }
}
