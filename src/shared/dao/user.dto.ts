import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { Drizzle, DRIZZLE_CONNECTION } from '../modules/drizzle/drizzle.module';
import { user } from '../modules/drizzle/schemas';
import { BaseDao } from './base.dto';

@Injectable()
export class UserDao extends BaseDao<typeof user> {
  private readonly logger = new Logger(UserDao.name);

  constructor(
    @Inject(DRIZZLE_CONNECTION)
    private readonly postgresDatabase: Drizzle,
  ) {
    super(user, postgresDatabase, {
      entityName: {
        singular: 'contact',
        plural: 'contacts',
      },
    });
  }

  private notFound(message?: string): never {
    throw new NotFoundException(message || 'Contact found');
  }
}
