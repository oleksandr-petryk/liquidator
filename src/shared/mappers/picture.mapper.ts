import { PictureDto } from '../dto/entities/picture.dto';
import type { SerializeMapper } from '../interfaces/mapper.interface';
import type { PictureSelectModel } from '../types/db.type';

export const UserMapper: SerializeMapper<PictureSelectModel, PictureDto> = {
  serialize: function (deserialized) {
    return new PictureDto({
      id: deserialized.id,
      picture: deserialized.picture,
      createdAt: deserialized.createdAt,
      updatedAt: deserialized.updatedAt,
    });
  },
};
