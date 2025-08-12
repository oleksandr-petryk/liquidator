export interface AbstractResponse<T> {
  payload: T;
}

export type PageableResponse<T> = AbstractResponse<{
  items: T[];
  count: number;
}>;

export interface Listable<T> {
  count: number;
  items: T[];
}
