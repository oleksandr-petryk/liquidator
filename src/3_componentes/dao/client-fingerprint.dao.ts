import { Inject, Injectable, Logger } from '@nestjs/common';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import {
  Drizzle,
  DRIZZLE_CONNECTION,
} from '../../4_low/drizzle/drizzle.module';
import { clientFingerprint } from '../../6_model/db';
import { BaseDao } from './base.dao';

export type ClientFingerprintInsertModel = InferInsertModel<
  typeof clientFingerprint
>;
export type ClientFingerprintSelectModel = InferSelectModel<
  typeof clientFingerprint
>;

@Injectable()
export class ClientFingerprintDao extends BaseDao<typeof clientFingerprint> {
  private readonly logger = new Logger(ClientFingerprintDao.name);

  constructor(
    @Inject(DRIZZLE_CONNECTION)
    private readonly postgresDatabase: Drizzle,
  ) {
    super(clientFingerprint, postgresDatabase, {
      entityName: {
        singular: 'client-fingerprint',
        plural: 'client-fingerprint',
      },
    });
  }
}
