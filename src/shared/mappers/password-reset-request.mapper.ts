import { PasswordResetRequestSelectModel } from '../dao/password-reset-request.dao';
import { PasswordResetRequestDto } from '../dto/entities/password-reset-request.dto';
import type { SerializeMapper } from '../interfaces/mapper.interface';
import { UserMapper } from './user.mapper';

export const PasswordResetRequestMapper: SerializeMapper<
  PasswordResetRequestSelectModel,
  PasswordResetRequestDto
> = {
  serialize: function (deserialized) {
    return new PasswordResetRequestDto({
      id: deserialized.id,
      code: deserialized.code,
      userId: deserialized.userId,
      expiresIn: deserialized.expiresIn,
      user: deserialized.user ? UserMapper.serialize(deserialized.user) : null,
      createdAt: deserialized.createdAt,
      updatedAt: deserialized.updatedAt,
    });
  },
};
