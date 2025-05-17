import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { Drizzle, DRIZZLE_CONNECTION } from '../modules/drizzle/drizzle.module';
import { organization } from '../modules/drizzle/schemas';
import { BaseDao } from './base.dto';

@Injectable()
export class OrganizationDao extends BaseDao<typeof organization> {
  private readonly logger = new Logger(OrganizationDao.name);

  constructor(
    @Inject(DRIZZLE_CONNECTION)
    private readonly postgresDatabase: Drizzle,
  ) {
    super(organization, postgresDatabase, {
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
