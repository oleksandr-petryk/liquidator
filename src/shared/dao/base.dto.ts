import { Logger } from '@nestjs/common';
import { InferInsertModel, InferSelectModel, sql, Table } from 'drizzle-orm';

import { DEFAULT_DB_BATCH_SIZE } from '../const/app';
import { Drizzle } from '../modules/drizzle/drizzle.module';

export class BaseDao<T extends Table<any>> {
  readonly logger = new Logger(BaseDao.name);

  constructor(
    protected readonly daoInstance: T,
    protected readonly postgres: Drizzle,
    protected readonly options: {
      entityName: {
        singular: string;
        plural: string;
      };
    },
  ) {}

  public async findOneOrThrow<T>(
    callback: () => Promise<T | null | undefined>,
    error: () => never,
  ): Promise<T> {
    const result = await callback();

    if (result == null) {
      return error();
    }

    return result;
  }

  public async countAll(): Promise<number> {
    const [{ count }] = await this.postgres
      .select({ count: sql<number>`count(*)::integer` })
      .from(this.daoInstance as any);
    return count;
  }

  public async forEachBatch<D extends InferSelectModel<T>>(
    callback: (batch: D[]) => void,
    batchSize = DEFAULT_DB_BATCH_SIZE,
  ): Promise<void> {
    let hasRecords = true;
    let offset = 0;

    do {
      const result = await this.postgres
        .select()
        .from(this.daoInstance as any)
        .offset(offset)
        .limit(batchSize);

      if (result.length < batchSize) {
        hasRecords = false;
      }

      if (result.length === 0) return;

      offset += batchSize;

      callback(result as Array<D>);
    } while (hasRecords);
  }

  public async create(
    insert: InferInsertModel<T>,
    db: Drizzle = this.postgres,
  ): Promise<InferSelectModel<T>> {
    try {
      const [inserted] = await db
        .insert(this.daoInstance)
        .values(insert)
        .returning();
      return inserted as InferSelectModel<T>;
    } catch (error) {
      this.logger.error(
        `Could not create ${this.options.entityName.singular}: ${error}`,
      );
      throw error;
    }
  }
}
