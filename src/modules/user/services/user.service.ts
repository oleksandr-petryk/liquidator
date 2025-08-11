import { BadRequestException, Injectable } from '@nestjs/common';

import { UserDao, UserSelectModel } from '../../../shared/dao/user.dao';
import { nonNullableUtils } from '../../../shared/utils/db.util';

@Injectable()
export class UserService {
  constructor(private readonly userDao: UserDao) {}

  public async getByUsername({
    username,
  }: {
    username: string;
  }): Promise<UserSelectModel> {
    const result = await this.userDao.findByUsername({ username });

    return nonNullableUtils(
      result,
      new BadRequestException('User not found, username: ' + username),
    );
  }

  public async getByPhoneNumber({
    phoneNumber,
  }: {
    phoneNumber: string;
  }): Promise<UserSelectModel> {
    const result = await this.userDao.findByPhoneNumber({ phoneNumber });

    return nonNullableUtils(
      result,
      new BadRequestException('User not found, phoneNumber: ' + phoneNumber),
    );
  }

  public async getById({ id }: { id: string }): Promise<UserSelectModel> {
    const result = await this.userDao.findById({ id });

    return nonNullableUtils(
      result,
      new BadRequestException('User not found, id: ' + id),
    );
  }
}
