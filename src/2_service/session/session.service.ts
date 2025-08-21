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

  public async updateSessionToken({
    userId,
    oldRefreshToken,
    refreshToken,
    jti,
  }: {
    userId: string;
    oldRefreshToken: string;
    refreshToken: string;
    jti: string;
  }): Promise<SessionSelectModel> {
    const oldRefreshTokenHash = crypto
      .createHash('sha256')
      .update(oldRefreshToken)
      .digest('hex');

    const sessionId = await this.sessionDao.findByUserIdAndRefreshTokenHash({
      userId,
      refreshTokenHash: oldRefreshTokenHash,
    });

    const refreshTokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    return await this.sessionDao.updateSession({
      data: { refreshTokenHash, jti },
      id: sessionId.id,
    });
  }
}
