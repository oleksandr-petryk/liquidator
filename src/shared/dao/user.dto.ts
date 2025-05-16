import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InferSelectModel } from 'drizzle-orm';

import { Drizzle, DRIZZLE_CONNECTION } from '../modules/drizzle/drizzle.module';
import { user } from '../modules/drizzle/schemas';
import { BaseDao } from './base.dto';

type ContactSelectModel = InferSelectModel<typeof user>;

@Injectable()
export class UserDao extends BaseDao<typeof user> {
  readonly logger = new Logger(UserDao.name);

  constructor(
    @Inject(DRIZZLE_CONNECTION)
    private readonly postgresDatabase: Drizzle,
  ) {
    super(user, postgresDatabase, {
      entityName: {
        singular: 'contact',
        plural: 'contacts',
      },
    });
  }

  private notFound(message?: string): never {
    throw new NotFoundException(message || 'Contact found');
  }

  async findById({
    db = this.postgresDatabase,
    id,
  }: {
    db?: Drizzle;
    id?: any;
  } = {}): Promise<ContactSelectModel | undefined> {
    try {
      const user = await db.query.user.findFirst({ where: id });

      return user;
    } catch (error) {
      this.logger.error(
        `Could not find ${this.options.entityName.plural}: ${error}`,
      );
      throw error;
    }
  }
}
