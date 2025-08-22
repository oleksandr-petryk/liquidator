import { Inject, Injectable, PipeTransform } from '@nestjs/common';

import {
  ClientFingerprintDao,
  ClientFingerprintSelectModel,
} from '../../3_components/dao/client-fingerprint.dao';
import { DRIZZLE_CONNECTION } from '../../4_low/drizzle/drizzle.module';

@Injectable()
export class CreateFingerprintPipe implements PipeTransform {
  constructor(
    @Inject(DRIZZLE_CONNECTION)
    private readonly clientFingerprintDao: ClientFingerprintDao,
  ) {}

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
