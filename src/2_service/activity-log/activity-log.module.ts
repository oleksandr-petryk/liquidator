import { Module } from '@nestjs/common';

import { DaoModule } from '../../3_components/dao/dao.module';
import { ActivityLogCreationService } from './activity-log-creation.service';

@Module({
  imports: [DaoModule],
  providers: [ActivityLogCreationService],
  exports: [ActivityLogCreationService],
})
export class ActivityLogModule {}
