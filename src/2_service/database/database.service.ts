import { Inject, Injectable } from '@nestjs/common';

import {
  Drizzle,
  DRIZZLE_CONNECTION,
} from '../../4_low/drizzle/drizzle.module';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(DRIZZLE_CONNECTION)
    private readonly postgresDatabase: Drizzle,
  ) {}

  public async transaction<T>(fn: (tx: Drizzle) => Promise<T>): Promise<T> {
    return await this.postgresDatabase.transaction(fn);
  }
}
