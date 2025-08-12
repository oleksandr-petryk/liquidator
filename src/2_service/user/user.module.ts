import { Module } from '@nestjs/common';

import { DaoModule } from '../../3_componentes/dao/dao.module';
import { UserService } from './user.service';

@Module({
  imports: [DaoModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
