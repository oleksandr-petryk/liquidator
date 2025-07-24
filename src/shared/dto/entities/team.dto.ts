import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

import { TeamSelectModel } from '../../dao/team.dao';
import { Status } from '../../enums/db.enum';
import { PictureDto } from './picture.dto';

export class TeamDto
  implements Record<keyof Omit<TeamSelectModel, 'teamToUser'>, any>
{
  @ApiProperty({
    description: 'ID',
    type: String,
    example: randomUUID(),
  })
  id!: string;

  @ApiProperty({
    description: 'Team name',
    type: String,
    example: 'Dev',
  })
  name!: string;

  @ApiProperty({
    description: 'Team status',
    type: String,
    enum: Status,
    example: Status.Published,
  })
  status!: Status;

  @ApiProperty({
    description: 'Team picture ID',
    type: String,
    example: `/pictures/${randomUUID()}.png`,
    nullable: true,
  })
  pictureId!: string | null;

  @ApiProperty({
    description: 'Is default team',
    type: Boolean,
    example: false,
    default: false,
  })
  isDefault!: boolean;

  @ApiProperty({
    description: 'Picture',
    type: PictureDto,
    nullable: true,
  })
  picture!: PictureDto | null;

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

  constructor(props: TeamDto) {
    Object.assign(this, props);
  }
}
