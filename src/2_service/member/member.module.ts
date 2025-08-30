import { Module } from '@nestjs/common';

import { DaoModule } from '../../3_components/dao/dao.module';
import { DtoMapper } from '../../6_model/dto/dto.mapper';
import { MemberService } from './member.service';

@Module({
  imports: [DaoModule],
  providers: [MemberService, DtoMapper],
  exports: [MemberService],
})
export class MemberModule {}
