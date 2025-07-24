import { SessionSelectModel } from '../dao/session.dao';
import { SessionDto } from '../dto/entities/session.dto';
import type { SerializeMapper } from '../interfaces/mapper.interface';

export const SessionMapper: SerializeMapper<SessionSelectModel, SessionDto> = {
  serialize: function (deserialized) {
    return new SessionDto({
      id: deserialized.id,
      name: deserialized.name,
      token: deserialized.token,
      userId: deserialized.userId,
      createdAt: deserialized.createdAt,
      updatedAt: deserialized.updatedAt,
    });
  },
};
