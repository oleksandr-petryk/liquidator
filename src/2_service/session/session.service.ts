import { BadRequestException, Injectable } from '@nestjs/common';

import {
  SessionDao,
  SessionSelectModel,
} from '../../3_componentes/dao/session.dao';
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
}
