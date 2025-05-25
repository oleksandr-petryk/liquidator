import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

import { Status } from '../../enums/db.enum';
import type { OrganizationSelectModel } from '../../types/db.type';

export class OrganizationDto
  implements Record<keyof OrganizationSelectModel, any>
{
  @ApiProperty({
    description: 'ID',
    type: String,
    example: randomUUID(),
  })
  id!: string;

  @ApiProperty({
    description: 'Status',
    type: String,
    enum: Status,
    example: Status.Published,
    nullable: true,
  })
  status!: Status | null;

  @ApiProperty({
    description: 'Org name',
    type: String,
    example: 'Li',
  })
  name!: string;

  @ApiProperty({
    description: 'Org slug',
    type: String,
    example: 'li',
  })
  slug!: string;

  @ApiProperty({
    description: 'Org picture ID',
    type: String,
    example: randomUUID(),
    nullable: true,
  })
  pictureId!: string | null;

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

  constructor(props: OrganizationDto) {
    Object.assign(this, props);
  }
}
