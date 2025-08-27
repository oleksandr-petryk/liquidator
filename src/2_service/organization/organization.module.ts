import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { OrganizationController } from '../../1_control/http/organization.controller';
import { DaoModule } from '../../3_components/dao/dao.module';
import { DtoMapper } from '../../6_model/dto/dto.mapper';
import { JwtInternalService } from '../auth/jwt-internal.service';
import { OrganizationService } from './organization.service';

@Module({
  imports: [DaoModule, JwtModule],
  providers: [OrganizationService, JwtInternalService, DtoMapper],
  exports: [OrganizationService],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
