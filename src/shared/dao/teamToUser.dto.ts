import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { Drizzle, DRIZZLE_CONNECTION } from '../modules/drizzle/drizzle.module';
import { teamToUser } from '../modules/drizzle/schemas';
import { BaseDao } from './base.dto';

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

  private notFound(message?: string): never {
    throw new NotFoundException(message || 'Team to user relation not found');
  }
}
