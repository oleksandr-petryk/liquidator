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
import { TransactionService } from '../database/database.service';

@Injectable()
export class OrganizationService {
  constructor(
    protected readonly configService: ConfigService,
    private readonly transactionService: TransactionService,
    private readonly organizationDao: OrganizationDao,
    private readonly roleDao: RoleDao,
    private readonly roleToPermissionDao: RoleToPermissionDao,
    private readonly permissionDao: PermissionDao,
    private readonly memberDao: MemberDao,
    private readonly memberToRoleDao: MemberToRoleDao,
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

  // public async createOrganization({
  //   name,
  //   slug,
  //   userId,
  // }: {
  //   name: string;
  //   slug: string;
  //   userId: string;
  // }): Promise<CreateOrganizationResponseBodyDto> {
  //   const newOrganization = await this.organizationDao.create({
  //     data: { name, slug },
  //   });

  //   const role = await this.roleDao.create({
  //     data: {
  //       organizationId: newOrganization.id,
  //       name: 'owner',
  //       permissions: { action: 'any' },
  //     },
  //   });

  //   await this.memberDao.create({
  //     data: { userId, organizationId: newOrganization.id, roleId: role.id },
  //   });

  //   return newOrganization;
  // }

  // public async getListOfUserOrganizations({
  //   userId,
  //   pagination,
  // }: {
  //   userId: string;
  //   pagination: DrizzlePagination;
  // }): Promise<Listable<Omit<MemberSelectModel, 'user' | 'role'>>> {
  //   const organizationsList = await this.memberDao.listSessionsByUserId({
  //     userId,
  //     pagination,
  //   });

  //   return organizationsList;
  // }

  // public async generatePairTokens({
  //   organizationId,
  //   userId,
  //   jti,
  // }: {
  //   organizationId: string;
  //   userId: string;
  //   jti: string;
  // }): Promise<JwtTokensPair> {
  //   const member = await this.memberDao.findByUserIdAndOrganizationId({
  //     organizationId,
  //     userId,
  //   });

  //   const role = await this.roleDao.findManyById({
  //     id: member.roleId,
  //   });

  //   const tokensPair = this.jwtInternalService.generatePairTokens({
  //     jti,
  //     id: userId,
  //     orgId: organizationId,
  //     roles: role.map((role) => role.name),
  //     permissions: role.map((item) => item.permissions.action),
  //   });

  //   return tokensPair;
  // }
}
