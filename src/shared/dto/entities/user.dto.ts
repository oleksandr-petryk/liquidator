import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

import { UserSelectModel } from '../../dao/user.dao';
import { Gender, Status } from '../../enums/db.enum';
import { PictureDto } from './picture.dto';

export class UserDto
  implements
    Record<
      keyof Omit<
        UserSelectModel,
        'password' | 'teamToUser' | 'pictureId' | 'passwordResetRequest'
      >,
      any
    >
{
  @ApiProperty({
    description: 'ID',
    type: String,
    example: randomUUID(),
  })
  id!: string;

  @ApiProperty({
    description: 'Team status',
    type: String,
    enum: Status,
    example: Status.Published,
    default: Status.Published,
  })
  status!: Status;

  @ApiProperty({
    description: 'Is account verifyed',
    type: Boolean,
    example: true,
    default: false,
  })
  verifyed!: boolean;

  @ApiProperty({
    description: 'User email',
    type: String,
    example: 'any@mail.com',
    nullable: false,
  })
  email!: string;

  @ApiProperty({
    description: 'User phone number',
    type: String,
    example: '+111111111111',
    nullable: true,
  })
  phoneNumber!: string | null;

  @ApiProperty({
    description: 'Username',
    type: String,
    example: 'JohnDoe',
    maxLength: 15,
    minLength: 4,
    nullable: true,
  })
  username!: string | null;

  @ApiProperty({
    description: 'First name',
    type: String,
    example: 'JohnDoe',
    maxLength: 35,
    minLength: 1,
    nullable: true,
  })
  firstName!: string | null;

  @ApiProperty({
    description: 'Last name',
    type: String,
    example: 'JohnDoe',
    maxLength: 35,
    minLength: 1,
    nullable: true,
  })
  lastName!: string | null;

  @ApiProperty({
    description: 'Date of firth',
    type: Date,
    example: new Date(),
    nullable: true,
  })
  dateOfBirth!: Date | null;

  @ApiProperty({
    description: 'Gender',
    type: String,
    example: Gender.Female,
    nullable: true,
  })
  gender!: Gender | null;

  @ApiProperty({
    description: 'Recovery email address',
    type: String,
    example: 'recovery@mamil.com',
    nullable: true,
  })
  recoveryEmailAddress!: string | null;

  @ApiProperty({
    description: 'User picture',
    type: PictureDto,
    nullable: true,
  })
  picture!: PictureDto | null | undefined;

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

  constructor(props: UserDto) {
    Object.assign(this, props);
  }
}
