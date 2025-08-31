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
import { member, permission, role, roleToPermission } from '../../6_model/db';
import { memberToRole } from '../../6_model/db/member-to-role';
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

  public async findDefaultByUserId({
    userId,
  }: {
    userId: string;
  }): Promise<Omit<MemberSelectModel, 'user' | 'organization' | 'role'>> {
    const [find] = await this.postgresDatabase
      .select()
      .from(member)
      .where(and(eq(member.userId, userId), eq(member.isDefault, true)))
      .orderBy(desc(member.createdAt))
      .limit(1);

    return find;
  }

  public async findUserRolesAndPermissionsByUserAndOrganizationId({
    userId,
    orgId,
  }: {
    userId: string;
    orgId: string;
  }): Promise<
    {
      memberId: string;
      roleId: string;
      roleName: string;
      permissionId: string;
      permission: string;
    }[]
  > {
    return await this.postgres
      .select({
        memberId: member.id,
        roleId: role.id,
        roleName: role.name,
        permissionId: permission.id,
        permission: permission.action,
      })
      .from(member)
      .innerJoin(memberToRole, eq(member.id, memberToRole.memberId))
      .innerJoin(role, eq(memberToRole.roleId, role.id))
      .innerJoin(roleToPermission, eq(role.id, roleToPermission.roleId))
      .innerJoin(permission, eq(roleToPermission.permissionId, permission.id))
      .where(and(eq(member.userId, userId), eq(member.organizationId, orgId)));
  }

  public async countByUserId({ userId }: { userId: string }): Promise<number> {
    const result = await this.postgresDatabase
      .select({ count: count(member.userId) })
      .from(member)
      .where(eq(member.userId, userId));

    return result[0]?.count;
  }
}
