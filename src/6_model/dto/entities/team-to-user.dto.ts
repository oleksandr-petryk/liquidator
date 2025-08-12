import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

import { TeamToUserSelectModel } from '../../../3_componentes/dao/team-to-user.dao';
import { Role } from '../../../5_shared/enums/db.enum';
import { TeamDto } from './team.dto';

export class TeamToUserDto
  implements Record<keyof Omit<TeamToUserSelectModel, 'user'>, any>
{
  @ApiProperty({
    description: 'User ID',
    type: String,
    example: randomUUID(),
  })
  userId!: string;

  @ApiProperty({
    description: 'Team ID',
    type: String,
    example: randomUUID(),
  })
  teamId!: string;

  @ApiProperty({
    description: 'User',
    type: TeamDto,
    nullable: true,
  })
  team!: TeamDto | null;

  @ApiProperty({
    description: 'User role',
    type: String,
    enum: Role,
    example: Role.Owner,
  })
  role!: Role;

  @ApiProperty({
    description: 'Is favorite team',
    type: Boolean,
    example: false,
    default: false,
  })
  isFavorite!: boolean;

  @ApiProperty({
    description: 'Is default team',
    type: Boolean,
    example: false,
    default: false,
  })
  isDefault!: boolean;

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

  constructor(props: TeamToUserDto) {
    Object.assign(this, props);
  }
}
