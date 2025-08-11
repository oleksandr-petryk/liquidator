import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { PictureController } from '../../1_control/http/picture.controller';
import { PictureDao } from '../../3_componentes/dao/pictures.dao';
import { UserDao } from '../../3_componentes/dao/user.dao';
import { S3Service } from '../../3_componentes/s3/s3.service';
import { JwtInternalService } from '../auth/jwt-internal.service';
import { PictureService } from './picture.service';

@Module({
  imports: [JwtModule],
  providers: [
    PictureService,
    JwtInternalService,
    PictureDao,
    UserDao,
    S3Service,
  ],
  exports: [PictureService],
  controllers: [PictureController],
})
export class PictureModule {}
