import { ApiProperty } from '@nestjs/swagger';

import { SessionSelectModel } from '../../../3_componentes/dao/session.dao';
import { PageableDto } from './dase.dto';

export class SessionDto
  implements Omit<SessionSelectModel, 'jti' | 'refreshTokenHash'>
{
  constructor(props: SessionDto) {
    Object.assign(this, props);
  }

  @ApiProperty({
    description: 'Session ID',
    type: String,
    example: '13507fbd-0976-4e00-8706-d37a2be5bb05',
  })
  id!: string;

  @ApiProperty({
    description: 'User ID',
    type: String,
    example: '3fb9b295-995e-464a-94fa-e853617f6adf',
  })
  userId!: string;

  @ApiProperty({
    description: 'Client fingerprint id',
    type: String,
    example: '3fb9b295-995e-464a-94fa-e853617f6adf',
  })
  clientFingerprintId!: string;

  @ApiProperty({
    description: 'Session name',
    type: String,
    nullable: true,
  })
  name!: string | null;

  @ApiProperty({
    description: 'Current device',
    type: Boolean,
    example: true,
    default: false,
  })
  thisDevice?: boolean;

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
}

export class SessionPageableDto extends PageableDto(SessionDto) {}
