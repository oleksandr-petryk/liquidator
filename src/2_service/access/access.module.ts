import { Module } from '@nestjs/common';

import { DaoModule } from '../../3_components/dao/dao.module';
import { MemberDao } from '../../3_components/dao/member.dao';
import { AccessService } from './access.service';

@Module({
  imports: [DaoModule],
  providers: [AccessService, MemberDao],
  exports: [AccessService],
})
export class AccessModule {}
