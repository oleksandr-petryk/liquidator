import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

import { RoleToPermissionSelectModel } from '../../../3_components/dao/role-to-permission.dao';

export class RoleToPermissionDto
  implements
    Record<keyof Omit<RoleToPermissionSelectModel, 'role' | 'permission'>, any>
{
  @ApiProperty({
    description: 'Role ID',
    type: String,
    example: randomUUID(),
  })
  roleId!: string;

  @ApiProperty({
    description: 'Permission ID',
    type: String,
    example: randomUUID(),
  })
  permissionId!: string;

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

  constructor(props: RoleToPermissionDto) {
    Object.assign(this, props);
  }
}
