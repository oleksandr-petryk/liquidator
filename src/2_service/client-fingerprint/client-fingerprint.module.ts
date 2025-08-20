import { Module } from '@nestjs/common';

import { DaoModule } from '../../3_components/dao/dao.module';
import { SessionService } from '../session/session.service';
import { ClientFingerprintService } from './client-fingerprint.service';

@Module({
  imports: [DaoModule],
  providers: [ClientFingerprintService, SessionService],
  exports: [ClientFingerprintService],
})
export class ClientFingerprintModule {}
