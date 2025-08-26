import { Module } from '@nestjs/common';

import { DaoModule } from '../../3_components/dao/dao.module';
import { JwtInternalService } from '../auth/jwt-internal.service';
import { OrganizationService } from './organization.service';

@Module({
  imports: [DaoModule],
  providers: [OrganizationService, JwtInternalService],
  exports: [OrganizationService],
  // controllers: [OrganizationController], todo
})
export class OrganizationModule {}
