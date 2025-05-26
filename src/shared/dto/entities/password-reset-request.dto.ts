import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

import type { PasswordResetRequestSelectModel } from '../../types/db.type';

export class PasswordResetRequestDto
  implements Record<keyof PasswordResetRequestSelectModel, any>
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
    description: 'Random cdode for password reset',
    type: String,
    example: randomUUID(),
    maxLength: 6,
    minLength: 6,
  })
  code!: string;

  @ApiProperty({
    description: 'User ID',
    type: String,
    example: randomUUID(),
  })
  expiresIn!: Date;

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
