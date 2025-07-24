export class PageablePayloadDto<T> {
  items!: T[];
  count!: number;
}
