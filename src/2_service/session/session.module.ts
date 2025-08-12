import { Module } from '@nestjs/common';

import { DaoModule } from '../../3_componentes/dao/dao.module';
import { SessionService } from './session.service';

@Module({
  imports: [DaoModule],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
