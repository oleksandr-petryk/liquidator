import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

import { MemberSelectModel } from '../../../3_components/dao/member.dao';

export class MemberDto
  implements
    Record<keyof Omit<MemberSelectModel, 'user' | 'organization' | 'role'>, any>
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

  constructor(props: MemberDto) {
    Object.assign(this, props);
  }
}
