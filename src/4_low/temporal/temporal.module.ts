import { Module } from '@nestjs/common';

import { TemporalService } from './temporal.service';
import { UserRegistrationSignal } from './user-registration/user-registration.signal';

@Module({
  providers: [TemporalService, UserRegistrationSignal],
  imports: [],
  exports: [TemporalService, UserRegistrationSignal],
})
export class TemporalModule {}
