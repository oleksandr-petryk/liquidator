import { TeamDto } from '../dto/entities/team.dto';
import type { SerializeMapper } from '../interfaces/mapper.interface';
import type { TeamSelectModel } from '../types/db.type';

export const UserMapper: SerializeMapper<TeamSelectModel, TeamDto> = {
  serialize: function (deserialized) {
    return new TeamDto({
      id: deserialized.id,
      status: deserialized.status,
      isDefault: deserialized.isDefault,
      name: deserialized.name,
      pictureId: deserialized.pictureId,
      createdAt: deserialized.createdAt,
      updatedAt: deserialized.updatedAt,
    });
  },
};
