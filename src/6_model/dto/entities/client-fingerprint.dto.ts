import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

import { ClientFingerprintSelectModel } from '../../../3_componentes/dao/client-fingerprint.dao';

export class ClientFingerprintDto
  implements
    Record<keyof Omit<ClientFingerprintSelectModel, 'clientFingerprint'>, any>
{
  @ApiProperty({
    description: 'ID',
    type: String,
    example: randomUUID(),
  })
  id!: string;

  @ApiProperty({
    description: 'User agent',
    type: String,
    example: 'Google chrome',
  })
  userAgent!: string | null;

  @ApiProperty({
    description: 'User ip',
    type: String,
    example: '127.0.0.1',
  })
  ip!: string;

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

  constructor(props: ClientFingerprintDto) {
    Object.assign(this, props);
  }
}
