import { Inject, Injectable, Logger } from '@nestjs/common';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import {
  Drizzle,
  DRIZZLE_CONNECTION,
} from '../../4_low/drizzle/drizzle.module';
import { organization } from '../../6_model/db';
import { BaseDao } from './base.dao';
import { PictureSelectModel } from './pictures.dao';

export type OrganizationInsertModel = InferInsertModel<typeof organization>;
export type OrganizationSelectModel = InferSelectModel<typeof organization> & {
  picture?: PictureSelectModel | null;
};

@Injectable()
export class OrganizationDao extends BaseDao<typeof organization> {
  private readonly logger = new Logger(OrganizationDao.name);

  constructor(
    @Inject(DRIZZLE_CONNECTION)
    private readonly postgresDatabase: Drizzle,
  ) {
    super(organization, postgresDatabase, {
      entityName: {
        singular: 'organization',
        plural: 'organization',
      },
    });
  }
}
