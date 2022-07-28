export interface ListResponse<T> {
  readonly total: number;
  readonly items: T[];
}

export const decisionOptions = ['Yes', 'No', 'Not Sure'] as const;

export type DecisionOption = typeof decisionOptions[number];

export type FetchPaginationOptions = {
  take?: number;
  skip?: number;
};

export type FetchOptions<TFilter = string[]> = {
  search?: string;
  filter?: TFilter;
} & FetchPaginationOptions;
