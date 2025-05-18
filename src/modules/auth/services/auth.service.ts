import { Injectable } from '@nestjs/common';
import { InferInsertModel } from 'drizzle-orm';

import { UserDao } from '../../../shared/dao/user.dto';
import { CreateUserDto } from '../../../shared/dto/createUser.dto';
import { user } from '../../../shared/modules/drizzle/schemas';

@Injectable()
export class AuthService {
  constructor(private userDao: UserDao) {}

  register(dto: CreateUserDto): Promise<InferInsertModel<typeof user>> {
    const newUser = this.userDao.create({ data: dto });

    return newUser;
  }

  login(): void {
    console.log('log-in');
  }

  verify(): void {
    console.log('verify');
  }

  google(): void {
    console.log('google');
  }

  googleCallback(): void {
    console.log('google callback');
  }
}
