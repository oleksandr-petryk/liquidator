import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  desc,
  eq,
  type InferInsertModel,
  type InferSelectModel,
} from 'drizzle-orm';

import {
  Drizzle,
  DRIZZLE_CONNECTION,
} from '../../4_low/drizzle/drizzle.module';
import { DrizzlePagination } from '../../5_shared/interfaces/db.interface';
import { member, organization } from '../../6_model/db';
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

  async findManyByMemberUserId({
    userId,
    pagination,
  }: {
    userId: string;
    pagination: DrizzlePagination;
  }): Promise<OrganizationSelectModel[]> {
    return await this.postgresDatabase
      .select({
        name: organization.name,
        slug: organization.slug,
        status: organization.status,
        createdAt: organization.createdAt,
        updatedAt: organization.updatedAt,
        id: organization.id,
        pictureId: organization.pictureId,
      })
      .from(member)
      .innerJoin(organization, eq(member.organizationId, organization.id))
      .where(eq(member.userId, userId))
      .offset(pagination.offset)
      .limit(pagination.limit)
      .orderBy(desc(organization.createdAt));
  }
}
