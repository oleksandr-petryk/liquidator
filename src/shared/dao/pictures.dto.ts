import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { Drizzle, DRIZZLE_CONNECTION } from '../modules/drizzle/drizzle.module';
import { picture } from '../modules/drizzle/schemas';
import { BaseDao } from './base.dto';

@Injectable()
export class PictureDao extends BaseDao<typeof picture> {
  private readonly logger = new Logger(PictureDao.name);

  constructor(
    @Inject(DRIZZLE_CONNECTION)
    private readonly postgresDatabase: Drizzle,
  ) {
    super(picture, postgresDatabase, {
      entityName: {
        singular: 'picture',
        plural: 'picture',
      },
    });
  }

  private notFound(message?: string): never {
    throw new NotFoundException(message || 'Picture not found');
  }
}
