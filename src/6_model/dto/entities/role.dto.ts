import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

import { RoleSelectModel } from '../../../3_components/dao/role.dao';

export class RoleDto
  implements Record<keyof Omit<RoleSelectModel, 'organization'>, any>
{
  @ApiProperty({
    description: 'ID',
    type: String,
    example: randomUUID(),
  })
  id!: string;

  @ApiProperty({
    description: 'Organization ID',
    type: String,
    example: randomUUID(),
  })
  organizationId!: string;

  @ApiProperty({
    description: 'Role name',
    type: String,
    example: 'member',
  })
  name!: string;

  @ApiProperty({
    description: 'Role permissions',
    type: String,
    example: 'member',
  })
  permissions!: unknown;

  constructor(props: RoleDto) {
    Object.assign(this, props);
  }
}
