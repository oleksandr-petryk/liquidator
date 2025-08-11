import { Module } from '@nestjs/common';

import { SessionDao } from '../../3_componentes/dao/session.dao';
import { SessionService } from './session.service';

@Module({
  providers: [SessionService, SessionDao],
  exports: [SessionService],
})
export class SessionModule {}
