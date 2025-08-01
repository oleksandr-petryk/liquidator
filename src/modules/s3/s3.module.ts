import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { PictureDao } from '../../shared/dao/pictures.dao';
import { UserDao } from '../../shared/dao/user.dao';
import { JwtInternalService } from '../auth/services/jwt-internal.service';
import { S3Controller } from './s3.controller';
import { S3Service } from './services/s3.service';

@Module({
  imports: [JwtModule],
  providers: [S3Service, JwtInternalService, PictureDao, UserDao],
  exports: [S3Service],
  controllers: [S3Controller],
})
export class S3Module {}
