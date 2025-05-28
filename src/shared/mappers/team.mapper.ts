import { TeamDto } from '../dto/entities/team.dto';
import type { SerializeMapper } from '../interfaces/mapper.interface';
import type { TeamSelectModel } from '../types/db.type';
import { PictureMapper } from './picture.mapper';
import { TeamToUserMapper } from './team-to-user.mapper';

export const TeamMapper: SerializeMapper<TeamSelectModel, TeamDto> = {
  serialize: function (deserialized) {
    return new TeamDto({
      id: deserialized.id,
      status: deserialized.status,
      isDefault: deserialized.isDefault,
      name: deserialized.name,
      pictureId: deserialized.pictureId,
      picture: deserialized.picture
        ? PictureMapper.serialize(deserialized.picture)
        : null,
      teamToUser: deserialized.teamToUser
        ? deserialized.teamToUser.map((i) => TeamToUserMapper.serialize(i))
        : null,
      createdAt: deserialized.createdAt,
      updatedAt: deserialized.updatedAt,
    });
  },
};
