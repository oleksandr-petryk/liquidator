import { Module } from '@nestjs/common';

import { SessionDao } from '../../shared/dao/session.dao';
import { SessionService } from './services/session.service';

@Module({
  providers: [SessionService, SessionDao],
  exports: [SessionService],
})
export class SessionModule {}
