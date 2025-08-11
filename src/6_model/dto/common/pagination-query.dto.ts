import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

import {
  APP_DEFAULT_PAGINATION_PAGE,
  APP_DEFAULT_PAGINATION_SIZE,
} from '../../../5_shared/config/const/app.const';

export class PaginationQueryDto {
  @ApiProperty({
    description: 'Page',
    type: Number,
    maximum: 1000,
    minimum: 1,
    default: APP_DEFAULT_PAGINATION_PAGE,
    example: APP_DEFAULT_PAGINATION_PAGE,
  })
  @Max(1000)
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page = APP_DEFAULT_PAGINATION_PAGE;

  @ApiProperty({
    description: 'Page size',
    type: Number,
    maximum: 1000,
    minimum: 1,
    default: APP_DEFAULT_PAGINATION_SIZE,
    example: APP_DEFAULT_PAGINATION_SIZE,
  })
  @Max(1000)
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  size = APP_DEFAULT_PAGINATION_SIZE;
}
