export interface ListResponse<T> {
  readonly total: number;
  readonly items: ReadonlyArray<T>;
}

export type DecisionOption = 'Yes' | 'No' | 'Not Sure';
