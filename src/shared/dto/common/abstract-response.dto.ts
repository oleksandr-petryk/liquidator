export class AbstractResponseDto<T> {
  payload!: T;
  requestId!: string;
}
