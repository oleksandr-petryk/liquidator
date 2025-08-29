import { Module } from '@nestjs/common';

import { DaoModule } from '../../3_components/dao/dao.module';
import { TransactionService } from '../database/database.service';
import { OrganizationService } from './organization.service';

@Module({
  imports: [DaoModule],
  providers: [OrganizationService, TransactionService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
