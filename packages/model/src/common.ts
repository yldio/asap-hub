export interface ListResponse<T> {
  readonly total: number;
  readonly items: ReadonlyArray<T>;
}
