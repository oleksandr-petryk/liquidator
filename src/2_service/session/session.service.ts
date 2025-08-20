import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

import {
  SessionDao,
  SessionSelectModel,
} from '../../3_components/dao/session.dao';
import { UserAgentAndIp } from '../../5_shared/decorators/user-agent-and-ip.decorator';
import { nonNullableUtils } from '../../5_shared/utils/db.util';

@Injectable()
export class SessionService {
  constructor(private readonly sessionDao: SessionDao) {}

  public async getById({ id }: { id: string }): Promise<SessionSelectModel> {
    const result = await this.sessionDao.findById({ id });

    return nonNullableUtils(
      result,
      new BadRequestException('Session not found, id: ' + id),
    );
  }

  public async createNewSession({
    userAgentAndIp,
    userId,
    clientFingerprintId,
    refreshToken,
    jti,
  }: {
    userAgentAndIp: UserAgentAndIp;
    userId: string;
    clientFingerprintId: string;
    refreshToken: string;
    jti: string;
  }): Promise<SessionSelectModel> {
    return await this.sessionDao.create({
      data: {
        name:
          userAgentAndIp.userAgent && userAgentAndIp.userAgent.length >= 9
            ? userAgentAndIp.userAgent.slice(0, 6) + '...'
            : userAgentAndIp.userAgent || '',
        userId,
        clientFingerprintId,
        refreshTokenHash: crypto
          .createHash('sha256')
          .update(refreshToken)
          .digest('hex'),
        jti,
      },
    });
  }

  public async getByJti(jti: string): Promise<SessionSelectModel> {
    const result = await this.sessionDao.findByJti({ jti });

    return nonNullableUtils(
      result,
      new BadRequestException('Session not found, jti: ' + jti),
    );
  }
}
