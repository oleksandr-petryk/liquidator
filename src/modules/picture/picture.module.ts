import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { PictureDao } from '../../shared/dao/pictures.dao';
import { UserDao } from '../../shared/dao/user.dao';
import { JwtInternalService } from '../auth/services/jwt-internal.service';
import { PictureController } from './picture.controller';
import { PictureService } from './services/picture.service';

@Module({
  imports: [JwtModule],
  providers: [PictureService, JwtInternalService, PictureDao, UserDao],
  exports: [PictureService],
  controllers: [PictureController],
})
export class PictureModule {}
