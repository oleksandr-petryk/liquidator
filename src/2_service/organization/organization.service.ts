import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  MemberDao,
  MemberSelectModel,
} from '../../3_components/dao/member.dao';
import { OrganizationDao } from '../../3_components/dao/organization.dao';
import { RoleDao } from '../../3_components/dao/role.dao';
import { Listable } from '../../5_shared/interfaces/abstract.interface';
import { DrizzlePagination } from '../../5_shared/interfaces/db.interface';
import { JwtTokensPair } from '../../5_shared/interfaces/jwt-token.interface';
import { CreateOrganizationResponseBodyDto } from '../../6_model/dto/io/organization/response-body.dto';
import { JwtInternalService } from '../auth/jwt-internal.service';

@Injectable()
export class OrganizationService {
  constructor(
    protected readonly configService: ConfigService,
    private readonly jwtInternalService: JwtInternalService,
    private readonly organizationDao: OrganizationDao,
    private readonly memberDao: MemberDao,
    private readonly roleDao: RoleDao,
  ) {}

  public async createOrganization({
    name,
    slug,
    userId,
  }: {
    name: string;
    slug: string;
    userId: string;
  }): Promise<CreateOrganizationResponseBodyDto> {
    const newOrganization = await this.organizationDao.create({
      data: { name, slug },
    });

    const role = await this.roleDao.create({
      data: {
        organizationId: newOrganization.id,
        name: 'owner',
        permissions: { action: 'any' },
      },
    });

    await this.memberDao.create({
      data: { userId, organizationId: newOrganization.id, roleId: role.id },
    });

    return newOrganization;
  }

  public async getListOfUserOrganizations({
    userId,
    pagination,
  }: {
    userId: string;
    pagination: DrizzlePagination;
  }): Promise<Listable<Omit<MemberSelectModel, 'user' | 'role'>>> {
    const organizationsList = await this.memberDao.listSessionsByUserId({
      userId,
      pagination,
    });

    return organizationsList;
  }

  public async generatePairTokens({
    organizationId,
    userId,
    jti,
  }: {
    organizationId: string;
    userId: string;
    jti: string;
  }): Promise<JwtTokensPair> {
    const member = await this.memberDao.findByUserIdAndOrganizationId({
      organizationId,
      userId,
    });

    const role = await this.roleDao.findManyById({
      id: member.roleId,
    });

    const tokensPair = this.jwtInternalService.generatePairTokens({
      jti,
      id: userId,
      orgId: organizationId,
      roles: role.map((role) => role.name),
      permissions: role.map((item) => item.permissions.action),
    });

    return tokensPair;
  }
}
