import { UserDto } from '../dto/entities/user.dto';
import type { SerializeMapper } from '../interfaces/mapper.interface';
import type { UserSelectModel } from '../types/db.type';

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
      createdAt: deserialized.createdAt,
      updatedAt: deserialized.updatedAt,
    });
  },
};
