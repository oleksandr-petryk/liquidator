import { Logger } from '@nestjs/common';
import {
  eq,
  InferInsertModel,
  InferSelectModel,
  sql,
  Table,
} from 'drizzle-orm';

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

  async findById({
    db = this.postgres,
    id,
  }: {
    db?: Drizzle;
    id: string;
  }): Promise<InferSelectModel<T>> {
    try {
      const table: any = this.daoInstance;

      const find = await db
        .select()
        .from(table as any)
        .where(eq(table.id, id));

      return find as InferSelectModel<T>;
    } catch (error) {
      this.baseLogger.error(
        `Could not find ${this.options.entityName.plural}: ${error}`,
      );
      throw error;
    }
  }

  public async create({
    db = this.postgres,
    data,
  }: {
    db?: Drizzle;
    data?: InferInsertModel<T>;
  } = {}): Promise<InferSelectModel<T>> {
    try {
      const [inserted] = await db
        .insert(this.daoInstance)
        .values(data as InferInsertModel<T>)
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
    data,
    id,
  }: {
    db?: Drizzle;
    data?: InferInsertModel<T>;
    id: string;
  }): Promise<InferSelectModel<T>> {
    try {
      const updated = await db
        .update(this.daoInstance)
        .set(data as InferInsertModel<T>)
        .where(eq(user.id, id));
      return updated as InferSelectModel<T>;
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
    id: string;
  }): Promise<InferSelectModel<T>> {
    try {
      const table: any = this.daoInstance;

      const deleted = await db
        .delete(table)
        .where(eq(table.id, id))
        .returning();
      return deleted as InferSelectModel<T>;
    } catch (error) {
      this.baseLogger.error(
        `Could not deleted ${this.options.entityName.plural}: ${error}`,
      );
      throw error;
    }
  }
}
