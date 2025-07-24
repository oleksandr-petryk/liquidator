export interface AbstractResponse<T> {
  payload: T;
}

export interface PageableResponse<T>
  extends AbstractResponse<{
    items: T[];
    count: number;
  }> {}

export interface Listable<T> {
  count: number;
  items: T[];
}
