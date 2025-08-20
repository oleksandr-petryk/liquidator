import { Injectable } from '@nestjs/common';

import {
  ClientFingerprintDao,
  ClientFingerprintSelectModel,
} from '../../3_components/dao/client-fingerprint.dao';
import { SessionService } from '../session/session.service';

@Injectable()
export class ClientFingerprintService {
  constructor(
    private readonly clientFingerprintDao: ClientFingerprintDao,
    private readonly sessionService: SessionService,
  ) {}

  async getByJti(jti: string): Promise<ClientFingerprintSelectModel> {
    const clientFingerprintId = await this.sessionService.getByJti(jti);

    return await this.clientFingerprintDao.findById(clientFingerprintId);
  }

  async getById(id: string): Promise<ClientFingerprintSelectModel> {
    return await this.clientFingerprintDao.findById({ id });
  }
}
