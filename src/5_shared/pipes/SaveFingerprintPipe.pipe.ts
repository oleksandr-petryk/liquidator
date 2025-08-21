import { Inject, Injectable, PipeTransform } from '@nestjs/common';

import { ClientFingerprintSelectModel } from '../../3_components/dao/client-fingerprint.dao';
import {
  Drizzle,
  DRIZZLE_CONNECTION,
} from '../../4_low/drizzle/drizzle.module';
import { clientFingerprint } from '../../6_model/db';

@Injectable()
export class SaveFingerprintPipe implements PipeTransform {
  constructor(
    @Inject(DRIZZLE_CONNECTION)
    private readonly drizzle: Drizzle,
  ) {}

  async transform(value: {
    userAgent?: string;
    ipAddress: string;
  }): Promise<ClientFingerprintSelectModel> {
    const [record] = await this.drizzle
      .insert(clientFingerprint)
      .values({
        userAgent: value.userAgent,
        ip: value.ipAddress,
      })
      .returning();

    return record;
  }
}
