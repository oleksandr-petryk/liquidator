import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';

import { Drizzle, DRIZZLE_CONNECTION } from '../modules/drizzle/drizzle.module';
import { picture } from '../modules/drizzle/schemas';
import { BaseDao } from './base.dao';

export type PictureInsertModel = InferInsertModel<typeof picture>;
export type PictureSelectModel = InferSelectModel<typeof picture>;

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
