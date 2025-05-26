import { TeamToUserDto } from '../dto/entities/team-to-user.dto';
import type { SerializeMapper } from '../interfaces/mapper.interface';
import type { TeamToUserSelectModel } from '../types/db.type';

export const UserMapper: SerializeMapper<TeamToUserSelectModel, TeamToUserDto> =
  {
    serialize: function (deserialized) {
      return new TeamToUserDto({
        isDefault: deserialized.isDefault,
        teamId: deserialized.teamId,
        userId: deserialized.userId,
        isFavorite: deserialized.isFavorite,
        role: deserialized.role,
        createdAt: deserialized.createdAt,
        updatedAt: deserialized.updatedAt,
      });
    },
  };
