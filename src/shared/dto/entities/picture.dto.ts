import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

import { PictureSelectModel } from '../../dao/pictures.dao';

export class PictureDto implements Record<keyof PictureSelectModel, any> {
  @ApiProperty({
    description: 'ID',
    type: String,
    example: randomUUID(),
  })
  id!: string;

  @ApiProperty({
    description: 'Picture URL',
    type: String,
    example: `/pictures/${randomUUID}.png`,
    maxLength: 256,
  })
  picture!: string;

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

  constructor(props: PictureDto) {
    Object.assign(this, props);
  }
}
