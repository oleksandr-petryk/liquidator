import { SessionDto } from '../dto/entities/session.dto';
import type { SerializeMapper } from '../interfaces/mapper.interface';
import type { SessionSelectModel } from '../types/db.type';

export const SessionMapper: SerializeMapper<SessionSelectModel, SessionDto> = {
  serialize: function (deserialized) {
    return new SessionDto({
      id: deserialized.id,
      name: deserialized.name,
      userId: deserialized.userId,
      refreshToken: deserialized.refreshToken,
      user: null,
      createdAt: deserialized.createdAt,
      updatedAt: deserialized.updatedAt,
    });
  },
};
