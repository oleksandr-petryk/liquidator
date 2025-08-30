import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { OrganizationController } from '../../1_control/http/organization.controller';
import { DaoModule } from '../../3_components/dao/dao.module';
import { DtoMapper } from '../../6_model/dto/dto.mapper';
import { AccessService } from '../access/access.service';
import { JwtInternalService } from '../auth/jwt-internal.service';
import { TransactionService } from '../database/database.service';
import { MemberService } from '../member/member.service';
import { OrganizationService } from './organization.service';

@Module({
  imports: [DaoModule],
  providers: [
    AccessService,
    JwtInternalService,
    TransactionService,
    MemberService,
    OrganizationService,
    JwtService,
    DtoMapper,
  ],
  exports: [OrganizationService],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
