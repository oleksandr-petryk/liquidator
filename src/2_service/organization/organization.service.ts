import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MemberDao } from '../../3_components/dao/member.dao';
import { MemberToRoleDao } from '../../3_components/dao/member-to-role.dao';
import {
  OrganizationDao,
  OrganizationSelectModel,
} from '../../3_components/dao/organization.dao';
import { PermissionDao } from '../../3_components/dao/permission.dao';
import { RoleDao } from '../../3_components/dao/role.dao';
import { RoleToPermissionDao } from '../../3_components/dao/role-to-permission.dao';
import { UserSelectModel } from '../../3_components/dao/user.dao';
import {
  ACCESS_DEFAULT_LIST_OF_ROLES,
  ACCESS_DEFAULT_ROLE_TO_PERMISSION_RELATION,
} from '../../5_shared/config/const/access.const';
import { Listable } from '../../5_shared/interfaces/abstract.interface';
import { DrizzlePagination } from '../../5_shared/interfaces/db.interface';
import {
  JwtTokenPayload,
  JwtTokensPair,
} from '../../5_shared/interfaces/jwt-token.interface';
import { AccessService } from '../access/access.service';
import { JwtInternalService } from '../auth/jwt-internal.service';
import { TransactionService } from '../database/database.service';
import { MemberService } from '../member/member.service';

@Injectable()
export class OrganizationService {
  constructor(
    protected readonly configService: ConfigService,
    private readonly transactionService: TransactionService,
    private readonly memberService: MemberService,
    private readonly organizationDao: OrganizationDao,
    private readonly roleDao: RoleDao,
    private readonly roleToPermissionDao: RoleToPermissionDao,
    private readonly permissionDao: PermissionDao,
    private readonly memberDao: MemberDao,
    private readonly memberToRoleDao: MemberToRoleDao,
    private readonly accessService: AccessService,
    private readonly jwtInternalService: JwtInternalService,
  ) {}

  public async create(user: UserSelectModel): Promise<OrganizationSelectModel> {
    const org = await this.organizationDao.create({
      data: { name: user.username, slug: user.username },
    });

    const roles = Object.keys(
      ACCESS_DEFAULT_ROLE_TO_PERMISSION_RELATION,
    ) as (keyof typeof ACCESS_DEFAULT_LIST_OF_ROLES)[];

    const owner = await this.memberDao.create({
      data: {
        isDefault: true,
        organizationId: org.id,
        userId: user.id,
      },
    });

    this.transactionService.transaction(async () => {
      for (const roleKey of roles) {
        const role = await this.roleDao.create({
          data: {
            name: roleKey,
            organizationId: org.id,
          },
        });

        if (roleKey === 'owner') {
          await this.memberToRoleDao.create({
            data: {
              memberId: owner.id,
              roleId: role.id,
            },
          });
        }

        const permissions = ACCESS_DEFAULT_ROLE_TO_PERMISSION_RELATION[roleKey];

        for (const permissionKey of permissions) {
          const permission = await this.permissionDao.create({
            data: {
              action: permissionKey,
              organizationId: org.id,
            },
          });

          await this.roleToPermissionDao.create({
            data: {
              roleId: role.id,
              permissionId: permission.id,
            },
          });
        }
      }
    });

    return org;
  }

  public async generateOrganizationTokens({
    organizationId,
    userId,
    jti,
  }: {
    organizationId: string;
    userId: string;
    jti: string;
  }): Promise<JwtTokensPair> {
    const member = await this.memberService.getByUserIdAndOrganizationId({
      organizationId,
      userId,
    });

    const accessData = member
      ? await this.accessService.serializeUserAccess({
          userId,
          orgId: member.organizationId,
        })
      : { roles: [], permissions: [] };

    const tokensPair = this.jwtInternalService.generatePairTokens({
      id: userId,
      jti,
      orgId: member?.organizationId,
      roles: accessData.roles,
      permissions: accessData.permissions,
    });

    return tokensPair;
  }

  public async getListOfUserOrganization(
    user: JwtTokenPayload,
    pagination: DrizzlePagination,
  ): Promise<Listable<OrganizationSelectModel>> {
    const [items, count] = await Promise.all([
      await this.organizationDao.findManyByMemberUserId({
        userId: user.id,
        pagination,
      }),
      await this.memberDao.countByUserId({ userId: user.id }),
    ]);

    return {
      items,
      count,
    };
  }
}
