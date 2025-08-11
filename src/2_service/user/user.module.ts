import { Module } from '@nestjs/common';

import { UserDao } from '../../3_componentes/dao/user.dao';
import { UserService } from './user.service';

@Module({
  providers: [UserService, UserDao],
  exports: [UserService],
})
export class UserModule {}
