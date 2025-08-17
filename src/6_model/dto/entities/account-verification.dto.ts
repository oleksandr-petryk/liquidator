import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

import { AccountVerificationSelectModel } from '../../../3_componentes/dao/account-verification.dao';

export class AccountVerificationDto
  implements Record<keyof Omit<AccountVerificationSelectModel, 'user'>, any>
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
    example: '123456',
    maxLength: 6,
    minLength: 6,
  })
  code!: string;

  @ApiProperty({
    description: 'Сode expiration date',
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

  constructor(props: AccountVerificationDto) {
    Object.assign(this, props);
  }
}
