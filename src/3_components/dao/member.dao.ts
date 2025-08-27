import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  and,
  count,
  desc,
  eq,
  type InferInsertModel,
  type InferSelectModel,
} from 'drizzle-orm';

import {
  Drizzle,
  DRIZZLE_CONNECTION,
} from '../../4_low/drizzle/drizzle.module';
import { Listable } from '../../5_shared/interfaces/abstract.interface';
import { DrizzlePagination } from '../../5_shared/interfaces/db.interface';
import { member, organization } from '../../6_model/db';
import { BaseDao } from './base.dao';
import { OrganizationSelectModel } from './organization.dao';
import { RoleSelectModel } from './role.dao';
import { UserSelectModel } from './user.dao';

export type MemberInsertModel = InferInsertModel<typeof member>;
export type MemberSelectModel = InferSelectModel<typeof member> & {
  user?: UserSelectModel | null;
  organization: OrganizationSelectModel | null;
  role?: RoleSelectModel | null;
};

@Injectable()
export class MemberDao extends BaseDao<typeof member> {
  private readonly logger = new Logger(MemberDao.name);

  constructor(
    @Inject(DRIZZLE_CONNECTION)
    private readonly postgresDatabase: Drizzle,
  ) {
    super(member, postgresDatabase, {
      entityName: {
        singular: 'member',
        plural: 'members',
      },
    });
  }

  public async findByUserIdAndOrganizationId({
    userId,
    organizationId,
  }: {
    userId: string;
    organizationId: string;
  }): Promise<Omit<MemberSelectModel, 'user' | 'organization' | 'role'>> {
    const [find] = await this.postgresDatabase
      .select()
      .from(member)
      .where(
        and(
          eq(member.organizationId, organizationId),
          eq(member.userId, userId),
        ),
      )
      .orderBy(desc(member.createdAt))
      .limit(1);

    return find;
  }

  async countByUserId({ userId }: { userId: string }): Promise<number> {
    const result = await this.postgresDatabase
      .select({ count: count(member.userId) })
      .from(member)
      .where(eq(member.userId, userId));

    return result[0]?.count;
  }

  public async findManyByUserId({
    userId,
    pagination,
  }: {
    userId: string;
    pagination?: DrizzlePagination;
  }): Promise<Omit<MemberSelectModel, 'user' | 'role'>[]> {
    if (pagination) {
      return await this.postgresDatabase
        .select({
          id: member.id,
          userId: member.userId,
          roleId: member.roleId,
          organizationId: member.organizationId,
          createdAt: member.createdAt,
          updatedAt: member.updatedAt,
          organization: organization,
        })
        .from(member)
        .innerJoin(organization, eq(member.organizationId, organization.id))
        .where(eq(member.userId, userId))
        .offset(pagination.offset)
        .limit(pagination.limit)
        .orderBy(desc(member.createdAt));
    }

    return await this.postgresDatabase
      .select({
        id: member.id,
        userId: member.userId,
        roleId: member.roleId,
        organizationId: member.organizationId,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
        organization: organization,
      })
      .from(member)
      .innerJoin(organization, eq(member.organizationId, organization.id))
      .where(eq(member.userId, userId));
  }

  async listSessionsByUserId({
    userId,
    pagination,
  }: {
    userId: string;
    pagination: DrizzlePagination;
  }): Promise<Listable<Omit<MemberSelectModel, 'user' | 'role'>>> {
    const [items, count] = await Promise.all([
      await this.findManyByUserId({ userId, pagination }),
      await this.countByUserId({ userId }),
    ]);

    return {
      items,
      count,
    };
  }

  public async findByUserId({
    userId,
  }: {
    userId: string;
  }): Promise<Omit<MemberSelectModel, 'user' | 'organization' | 'role'>> {
    const [find] = await this.postgresDatabase
      .select()
      .from(member)
      .where(eq(member.userId, userId))
      .orderBy(desc(member.createdAt))
      .limit(1);

    return find;
  }
}
