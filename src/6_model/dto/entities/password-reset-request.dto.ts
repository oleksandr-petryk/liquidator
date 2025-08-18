import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

import { PasswordResetRequestSelectModel } from '../../../3_components/dao/password-reset-request.dao';

export class PasswordResetRequestDto
  implements Record<keyof Omit<PasswordResetRequestSelectModel, 'user'>, any>
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
    description: 'Random code for password reset',
    type: String,
    example: randomUUID(),
    maxLength: 6,
    minLength: 6,
  })
  code!: string;

  @ApiProperty({
    description: 'Code expiration date',
    type: Date,
    example: new Date(),
  })
  expiresAt!: Date;

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

  constructor(props: PasswordResetRequestDto) {
    Object.assign(this, props);
  }
}
