import { OmitType } from '@nestjs/swagger';

import { OrganizationDto } from '../../entities/organization.dto';

export class CreateOrganizationResponseBodyDto extends OmitType(
  OrganizationDto,
  ['picture'],
) {}
