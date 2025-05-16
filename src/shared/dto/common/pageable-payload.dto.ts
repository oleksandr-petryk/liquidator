export class PageablePayloadDto<PI> {
  currentPageItems!: PI[];
  totalNumber!: number;
}
