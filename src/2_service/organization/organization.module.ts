import { Module } from '@nestjs/common';

import { DaoModule } from '../../3_components/dao/dao.module';
import { OrganizationService } from './organization.service';

@Module({
  imports: [DaoModule],
  providers: [OrganizationService],
  exports: [OrganizationService],
  // controllers: [OrganizationController], todo
})
export class OrganizationModule {}
