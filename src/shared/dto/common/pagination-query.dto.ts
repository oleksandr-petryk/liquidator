import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

import {
  DEFAULT_PAGINATION_PAGE,
  DEFAULT_PAGINATION_SIZE,
} from '../../const/app.const';

export class PaginationQueryDto {
  @ApiProperty({
    description: 'Page',
    type: Number,
    maximum: 1000,
    minimum: 1,
    default: DEFAULT_PAGINATION_PAGE,
    example: DEFAULT_PAGINATION_PAGE,
  })
  @Max(1000)
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page = DEFAULT_PAGINATION_PAGE;

  @ApiProperty({
    description: 'Page size',
    type: Number,
    maximum: 1000,
    minimum: 1,
    default: DEFAULT_PAGINATION_SIZE,
    example: DEFAULT_PAGINATION_SIZE,
  })
  @Max(1000)
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  size = DEFAULT_PAGINATION_SIZE;
}
