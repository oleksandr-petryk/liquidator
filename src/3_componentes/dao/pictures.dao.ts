import { Inject, Injectable, Logger } from '@nestjs/common';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import {
  Drizzle,
  DRIZZLE_CONNECTION,
} from '../../4_low/drizzle/drizzle.module';
import { picture } from '../../6_model/db';
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
}
