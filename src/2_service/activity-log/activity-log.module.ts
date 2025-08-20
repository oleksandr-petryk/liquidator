import { Module } from '@nestjs/common';

import { DaoModule } from '../../3_components/dao/dao.module';
import { ActivityLogService } from './activity-log.service';

@Module({
  imports: [DaoModule],
  providers: [ActivityLogService],
  exports: [ActivityLogService],
})
export class ActivityLogModule {}
