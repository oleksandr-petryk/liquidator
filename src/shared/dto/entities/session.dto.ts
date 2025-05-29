import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

import type { SessionSelectModel } from '../../types/db.type';
import { UserDto } from './user.dto';

export class SessionDto implements Record<keyof SessionSelectModel, any> {
  @ApiProperty({
    description: 'ID',
    type: String,
    example: randomUUID(),
  })
  id!: string;

  @ApiProperty({
    description: 'Device name',
    type: String,
    example: 'MacBook',
  })
  name!: string;

  @ApiProperty({
    description: 'User id',
    type: String,
    example: randomUUID(),
  })
  userId!: string;

  @ApiProperty({
    description: 'Refresh token used to renew access tokens',
    type: String,
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI...H4Q',
  })
  refreshToken!: string;

  @ApiProperty({
    description: 'User',
    type: UserDto,
    nullable: true,
  })
  user!: UserDto | null;

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

  constructor(props: SessionDto) {
    Object.assign(this, props);
  }
}
