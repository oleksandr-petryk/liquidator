import { TeamToUserDto } from '../dto/entities/team-to-user.dto';
import type { SerializeMapper } from '../interfaces/mapper.interface';
import type { TeamToUserSelectModel } from '../types/db.type';
import { TeamMapper } from './team.mapper';

export const TeamToUserMapper: SerializeMapper<
  TeamToUserSelectModel,
  TeamToUserDto
> = {
  serialize: function (deserialized) {
    return new TeamToUserDto({
      isDefault: deserialized.isDefault,
      teamId: deserialized.teamId,
      userId: deserialized.userId,
      isFavorite: deserialized.isFavorite,
      role: deserialized.role,
      team: deserialized.team ? TeamMapper.serialize(deserialized.team) : null,
      user: null,
      createdAt: deserialized.createdAt,
      updatedAt: deserialized.updatedAt,
    });
  },
};
