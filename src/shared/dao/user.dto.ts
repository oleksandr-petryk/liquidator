import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { Drizzle, DRIZZLE_CONNECTION } from '../modules/drizzle/drizzle.module';
import { user, UserSelectModel } from '../modules/drizzle/schemas';
import { BaseDao } from './base.dto';

@Injectable()
export class UserDao extends BaseDao<typeof user> {
  private readonly logger = new Logger(UserDao.name);

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
    throw new NotFoundException(message || 'Contact not found');
  }

  public async findByEmail({
    db = this.postgres,
    email,
  }: {
    db?: Drizzle;
    email: string;
  }): Promise<UserSelectModel> {
    try {
      const find = await db.query.user.findFirst({
        where: eq(user.email, email),
      });

      return find as UserSelectModel;
    } catch (error) {
      this.logger.error(
        `Could not find ${this.options.entityName.plural}: ${error}`,
      );
      throw error;
    }
  }
}
