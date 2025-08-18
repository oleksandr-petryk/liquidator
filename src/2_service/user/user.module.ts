import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserController } from '../../1_control/http/user.controller';
import { DaoModule } from '../../3_components/dao/dao.module';
import { DtoMapper } from '../../6_model/dto/dto.mapper';
import { JwtInternalService } from '../auth/jwt-internal.service';
import { UserService } from './user.service';

@Module({
  imports: [DaoModule],
  controllers: [UserController],
  providers: [UserService, DtoMapper, JwtInternalService, JwtService],
  exports: [UserService],
})
export class UserModule {}
