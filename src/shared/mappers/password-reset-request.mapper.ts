import { PasswordResetRequestDto } from '../dto/entities/password-reset-request.dto';
import type { SerializeMapper } from '../interfaces/mapper.interface';
import type { PasswordResetRequestSelectModel } from '../types/db.type';

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
      createdAt: deserialized.createdAt,
      updatedAt: deserialized.updatedAt,
    });
  },
};
