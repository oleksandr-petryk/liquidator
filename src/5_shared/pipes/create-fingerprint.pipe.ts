import { Injectable, PipeTransform } from '@nestjs/common';

import {
  ClientFingerprintDao,
  ClientFingerprintSelectModel,
} from '../../3_components/dao/client-fingerprint.dao';

@Injectable()
export class CreateFingerprintPipe implements PipeTransform {
  constructor(private readonly clientFingerprintDao: ClientFingerprintDao) {}

  async transform(value: {
    userAgent?: string;
    ipAddress: string;
  }): Promise<ClientFingerprintSelectModel> {
    const record = await this.clientFingerprintDao.create({
      data: { userAgent: value.userAgent, ip: value.ipAddress },
    });

    return record;
  }
}
