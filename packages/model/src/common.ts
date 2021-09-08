export interface ListResponse<T> {
  readonly total: number;
  readonly items: ReadonlyArray<T>;
}

export const decisionOptions = ['Yes', 'No', 'Not Sure'] as const;

export type DecisionOption = typeof decisionOptions[number];
