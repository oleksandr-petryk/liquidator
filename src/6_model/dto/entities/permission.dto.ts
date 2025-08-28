import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

import { PermissionSelectModel } from '../../../3_components/dao/permission.dao';

export class PermissionDto implements Record<keyof PermissionSelectModel, any> {
  @ApiProperty({
    description: 'ID',
    type: String,
    example: randomUUID(),
  })
  id!: string;

  @ApiProperty({
    description: 'Allowed action',
    type: String,
    example: 'delete organization',
  })
  action!: string;

  @ApiProperty({
    description: 'Organization ID',
    type: String,
    example: randomUUID(),
  })
  organizationId!: string;

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

  constructor(props: PermissionDto) {
    Object.assign(this, props);
  }
}
