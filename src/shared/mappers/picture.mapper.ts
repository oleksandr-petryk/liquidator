import { PictureSelectModel } from '../dao/pictures.dao';
import { PictureDto } from '../dto/entities/picture.dto';
import type { SerializeMapper } from '../interfaces/mapper.interface';

export const PictureMapper: SerializeMapper<PictureSelectModel, PictureDto> = {
  serialize: function (deserialized) {
    return new PictureDto({
      id: deserialized.id,
      picture: deserialized.picture,
      createdAt: deserialized.createdAt,
      updatedAt: deserialized.updatedAt,
    });
  },
};
