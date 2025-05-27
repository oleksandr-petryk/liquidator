import { OrganizationDto } from '../dto/entities/organization.dto';
import type { SerializeMapper } from '../interfaces/mapper.interface';
import type { OrganizationSelectModel } from '../types/db.type';
import { PictureMapper } from './picture.mapper';

export const OrganizationMapper: SerializeMapper<
  OrganizationSelectModel,
  OrganizationDto
> = {
  serialize: function (deserialized) {
    return new OrganizationDto({
      id: deserialized.id,
      status: deserialized.status,
      name: deserialized.name,
      slug: deserialized.slug,
      pictureId: deserialized.pictureId,
      picture: deserialized.picture
        ? PictureMapper.serialize(deserialized.picture)
        : null,
      createdAt: deserialized.createdAt,
      updatedAt: deserialized.updatedAt,
    });
  },
};
