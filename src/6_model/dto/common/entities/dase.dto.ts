import { Type } from '@nestjs/common';
import { ApiHideProperty } from '@nestjs/swagger';

import { PageablePayloadDto } from '../pageable-payload.dto';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-unused-vars
export function PageableDto<T extends Type>(item: T) {
  class PageableDto implements PageablePayloadDto<T> {
    constructor({ items, count }: { items: InstanceType<T>[]; count: number }) {
      this.items = items;
      this.count = count;
    }

    @ApiHideProperty()
    items: InstanceType<T>[];
    count: number;
  }

  return PageableDto;
}
