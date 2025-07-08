import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { Drizzle, DRIZZLE_CONNECTION } from '../modules/drizzle/drizzle.module';
import { session } from '../modules/drizzle/schemas/session';
import { SessionInsertModel, SessionSelectModel } from '../types/db.type';
import { BaseDao } from './base.dto';

@Injectable()
export class SessionDao extends BaseDao<typeof session> {
  private readonly logger = new Logger(SessionDao.name);

  constructor(
    @Inject(DRIZZLE_CONNECTION)
    private readonly postgresDatabase: Drizzle,
  ) {
    super(session, postgresDatabase, {
      entityName: {
        singular: 'session',
        plural: 'session',
      },
    });
  }

  private notFound(message?: string): never {
    throw new NotFoundException(message || 'Session not found');
  }

  async findByIdOrThrow({
    db = this.postgres,
    id,
  }: {
    db?: Drizzle;
    id: string;
  }): Promise<SessionSelectModel[] | void> {
    await this.findOneOrThrow(
      async () => {
        const table: any = this.daoInstance;

        const find = await db
          .select()
          .from(table as any)
          .where(eq(table.id, id));

        return find[0] as SessionSelectModel;
      },
      () => {
        throw new BadRequestException('Session not find');
      },
    );
  }

  async findByUserId({
    db = this.postgres,
    id,
  }: {
    db?: Drizzle;
    id: string;
  }): Promise<SessionSelectModel[]> {
    try {
      const table: any = this.daoInstance;

      const find = await db
        .select()
        .from(table as any)
        .where(eq(table.userId, id));

      return find as SessionSelectModel[];
    } catch (error) {
      this.logger.error(
        `Could not find ${this.options.entityName.plural}: ${error}`,
      );
      throw error;
    }
  }

  public async updateSessionName({
    db = this.postgres,
    data,
    id,
  }: {
    db?: Drizzle;
    data?: string;
    id: string;
  }): Promise<Omit<SessionInsertModel, 'user'> | unknown> {
    try {
      const updated = await db
        .update(this.daoInstance)
        .set({ name: data, updatedAt: new Date() })
        .where(eq(session.id, id))
        .returning();
      return updated;
    } catch (error) {
      this.logger.error(
        `Could not updated ${this.options.entityName.plural}: ${error}`,
      );
      throw error;
    }
  }
}
