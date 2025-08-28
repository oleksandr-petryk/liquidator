import { ApiProperty, OmitType } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

import { MemberSelectModel } from '../../../3_components/dao/member.dao';
import { PageableDto } from './base.dto';
import { OrganizationDto } from './organization.dto';

export class MemberDto
  implements Record<keyof Omit<MemberSelectModel, 'user' | 'role'>, any>
{
  @ApiProperty({
    description: 'ID',
    type: String,
    example: randomUUID(),
  })
  id!: string;

  @ApiProperty({
    description: 'User ID',
    type: String,
    example: randomUUID(),
  })
  userId!: string;

  @ApiProperty({
    description: 'Organization ID',
    type: String,
    example: randomUUID(),
  })
  organizationId!: string;

  @ApiProperty({
    description: 'Role ID',
    type: String,
    example: randomUUID(),
  })
  roleId!: string;

  @ApiProperty({
    description: 'Current organization',
    type: Boolean,
    example: true,
    default: false,
  })
  currentOrganization?: boolean;

  @ApiProperty({
    description: 'Date created',
    type: Date,
    example: new Date(),
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Date updated',
    type: Date,
    example: new Date(),
    nullable: true,
  })
  updatedAt!: Date | null;

  @ApiProperty({
    description: 'Organization',
    type: OmitType(OrganizationDto, ['picture']),
    nullable: true,
  })
  organization!: Omit<OrganizationDto, 'picture'> | null;

  constructor(props: MemberDto) {
    Object.assign(this, props);
  }
}

export class MemberPageableDto extends PageableDto(MemberDto) {}
