import { Injectable } from '@nestjs/common';

import { MemberDao } from '../../3_components/dao/member.dao';

@Injectable()
export class AccessService {
  constructor(private readonly memberDao: MemberDao) {}

  public async serializeUserAccess({
    userId,
    orgId,
  }: {
    userId: string;
    orgId: string;
  }): Promise<{ roles: string[]; permissions: string[] }> {
    const rows =
      await this.memberDao.findUserRolesAndPermissionsByUserAndOrganizationId({
        userId,
        orgId,
      });

    const roles = Array.from(new Set(rows.map((r) => r.roleName)));
    const permissions = Array.from(new Set(rows.map((r) => r.permission)));

    return { roles, permissions };
  }
}
