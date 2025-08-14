import { BadRequestException, Injectable } from '@nestjs/common';

import { UserDao, UserSelectModel } from '../../3_componentes/dao/user.dao';
import { nonNullableUtils } from '../../5_shared/utils/db.util';

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

  public async getByEmail({
    email,
  }: {
    email: string;
  }): Promise<UserSelectModel> {
    const result = await this.userDao.findByEmail({ email });

    return nonNullableUtils(
      result,
      new BadRequestException('User not found, email: ' + email),
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

  public async changePassword({
    newPassword,
    userId,
  }: {
    newPassword: string;
    userId: string;
  }): Promise<void> {
    await this.userDao.update({ data: { password: newPassword }, id: userId });
  }
}
