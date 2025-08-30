import { BadRequestException, Injectable } from '@nestjs/common';

import {
  MemberDao,
  MemberSelectModel,
} from '../../3_components/dao/member.dao';
import { nonNullableUtils } from '../../5_shared/utils/db.util';

@Injectable()
export class MemberService {
  constructor(private readonly memberDao: MemberDao) {}

  public async getByUserIdAndOrganizationId({
    userId,
    organizationId,
  }: {
    userId: string;
    organizationId: string;
  }): Promise<Omit<MemberSelectModel, 'user' | 'organization' | 'role'>> {
    const result = await this.memberDao.findByUserIdAndOrganizationId({
      userId,
      organizationId,
    });

    return nonNullableUtils(
      result,
      new BadRequestException(
        'Member not found, organization id: ' + organizationId,
      ),
    );
  }
}
