import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MemberDao } from '../../3_components/dao/member.dao';
import {
  OrganizationDao,
  OrganizationSelectModel,
} from '../../3_components/dao/organization.dao';
import { RoleDao } from '../../3_components/dao/role.dao';
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
      data: { organizationId: newOrganization.id, name: 'owner' },
    });

    await this.memberDao.create({
      data: { userId, organizationId: newOrganization.id, roleId: role.id },
    });

    return newOrganization;
  }

  public async getOrganizationTokens({
    organizationId,
    userId,
  }: {
    organizationId: string;
    userId: string;
  }): Promise<Omit<OrganizationSelectModel, 'picture'>> {
    const user = await this.memberDao.findByUserIdAndOrganizationId({
      organizationId,
      userId,
    });

    const role = await this.roleDao.findById({
      id: user.roleId,
    });
    
    const accessTokens = this.jwtInternalService.
  }
}
