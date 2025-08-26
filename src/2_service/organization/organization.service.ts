import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MemberDao } from '../../3_components/dao/member.dao';
import {
  OrganizationDao,
  OrganizationSelectModel,
} from '../../3_components/dao/organization.dao';
import { RoleDao } from '../../3_components/dao/role.dao';
import { JwtTokensPair } from '../../5_shared/interfaces/jwt-token.interface';
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
  }): Promise<Omit<OrganizationSelectModel, 'picture'>> {
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

    const pairTokens = this.jwtInternalService.generatePairTokens({
      jti,
      id: userId,
      orgId: organizationId,
      roles: role.map((role) => role.name),
      permissions: role.map((item) => item.permissions.action),
    });

    return pairTokens;
  }
}
