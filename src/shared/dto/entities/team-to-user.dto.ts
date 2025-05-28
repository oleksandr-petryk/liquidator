import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

import { Role } from '../../enums/db.enum';
import type { TeamToUserSelectModel } from '../../types/db.type';
import { TeamDto } from './team.dto';
import { UserDto } from './user.dto';

export class TeamToUserDto implements Record<keyof TeamToUserSelectModel, any> {
  @ApiProperty({
    description: 'User ID',
    type: String,
    example: randomUUID(),
  })
  userId!: string;

  @ApiProperty({
    description: 'User',
    type: UserDto,
    nullable: true,
  })
  user!: UserDto | null;

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
