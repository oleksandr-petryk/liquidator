import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { Drizzle, DRIZZLE_CONNECTION } from '../modules/drizzle/drizzle.module';
import { team } from '../modules/drizzle/schemas';
import { BaseDao } from './base.dto';

@Injectable()
export class TeamDao extends BaseDao<typeof team> {
  private readonly logger = new Logger(TeamDao.name);

  constructor(
    @Inject(DRIZZLE_CONNECTION)
    private readonly postgresDatabase: Drizzle,
  ) {
    super(team, postgresDatabase, {
      entityName: {
        singular: 'contact',
        plural: 'contacts',
      },
    });
  }

  private notFound(message?: string): never {
    throw new NotFoundException(message || 'Team not found');
  }
}
