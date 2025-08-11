import { ApiProperty } from '@nestjs/swagger';

import { APP_HEALTH_LIVE } from '../../../../../5_shared/config/const/app.const';

export class GetHealthResponseBodyDto {
  @ApiProperty({
    description: 'Server status',
    type: String,
    example: APP_HEALTH_LIVE,
  })
  status!: string;
}

export class GetAppVersionResponseBodyDto {
  @ApiProperty({
    description: 'Application version',
    type: String,
    example: '0.1.0',
  })
  version!: string;
}
