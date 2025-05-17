import { Injectable } from '@nestjs/common';
import { InferInsertModel } from 'drizzle-orm';

import { UserDao } from '../../../shared/dao/user.dto';
import { Gender, user } from '../../../shared/modules/drizzle/schemas';

@Injectable()
export class AuthService {
  constructor(private userDao: UserDao) {}

  register(userData: {
    email: string;
    phoneNumber: string;
    username: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: Gender | null | undefined;
    pictureId: number | null;
    password: string;
    recoveryEmailAddress: string;
  }): Promise<InferInsertModel<typeof user>> {
    const newUser = this.userDao.create({ data: userData });

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
