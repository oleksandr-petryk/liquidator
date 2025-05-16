import { Logger } from '@nestjs/common';
import {
  eq,
  InferInsertModel,
  InferSelectModel,
  sql,
  Table,
} from 'drizzle-orm';
import { QueryResult } from 'pg';

import { DEFAULT_DB_BATCH_SIZE } from '../const/db';
import { Drizzle } from '../modules/drizzle/drizzle.module';
import { user } from '../modules/drizzle/schemas';

export class BaseDao<T extends Table<any>> {
  private readonly baseLogger = new Logger(BaseDao.name);

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
      this.baseLogger.error(
        `Could not create ${this.options.entityName.singular}: ${error}`,
      );
      throw error;
    }
  }

  public async update({
    db = this.postgres,
    value,
    id,
  }: {
    db?: Drizzle;
    value?: any;
    id?: any;
  } = {}): Promise<QueryResult<never>> {
    try {
      const updatedUser = await db
        .update(user)
        .set(value)
        .where(eq(user.id, id));
      return updatedUser;
    } catch (error) {
      this.baseLogger.error(
        `Could not updated ${this.options.entityName.plural}: ${error}`,
      );
      throw error;
    }
  }

  async delete({
    db = this.postgres,
    id,
  }: {
    db?: Drizzle;
    id?: any;
  } = {}): Promise<QueryResult<never>> {
    try {
      const deletedUser = await db.delete(user).where(eq(user.id, id));
      return deletedUser;
    } catch (error) {
      this.baseLogger.error(
        `Could not deleted ${this.options.entityName.plural}: ${error}`,
      );
      throw error;
    }
  }
}
