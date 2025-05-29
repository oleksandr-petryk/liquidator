import { UserDto } from '../dto/entities/user.dto';
import type { SerializeMapper } from '../interfaces/mapper.interface';
import type { UserSelectModel } from '../types/db.type';
import { PasswordResetRequestMapper } from './password-reset-request.mapper';
import { PictureMapper } from './picture.mapper';
import { SessionMapper } from './session.mapper';
import { TeamToUserMapper } from './team-to-user.mapper';

export const UserMapper: SerializeMapper<UserSelectModel, UserDto> = {
  serialize: function (deserialized) {
    return new UserDto({
      id: deserialized.id,
      status: deserialized.status,
      username: deserialized.username,
      email: deserialized.email,
      firstName: deserialized.firstName,
      lastName: deserialized.lastName,
      pictureId: deserialized.pictureId,
      dateOfBirth: deserialized.dateOfBirth,
      gender: deserialized.gender,
      phoneNumber: deserialized.phoneNumber,
      recoveryEmailAddress: deserialized.recoveryEmailAddress,
      passwordResetRequest: deserialized.passwordResetRequest
        ? deserialized.passwordResetRequest.map((i) =>
            PasswordResetRequestMapper.serialize(i),
          )
        : null,
      picture: deserialized.picture
        ? PictureMapper.serialize(deserialized.picture)
        : null,
      teamToUser: deserialized.teamToUser
        ? deserialized.teamToUser.map((i) => TeamToUserMapper.serialize(i))
        : null,
      createdAt: deserialized.createdAt,
      updatedAt: deserialized.updatedAt,
      session: deserialized.session
        ? deserialized.session.map((i) => SessionMapper.serialize(i))
        : null,
    });
  },
};
