import { Module } from '@nestjs/common';

import { UserDao } from '../../shared/dao/user.dao';
import { UserService } from './services/user.service';

@Module({
  providers: [UserService, UserDao],
  exports: [UserService],
})
export class UserModule {}
