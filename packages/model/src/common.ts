export interface ListResponse<T> {
  readonly total: number;
  readonly items: T[];
}

export const decisionOptions = ['Yes', 'No', 'Not Sure'] as const;

export type DecisionOption = (typeof decisionOptions)[number];

export type FetchPaginationOptions = {
  take?: number;
  skip?: number;
};

export type AllOrNone<T> = T | { [K in keyof T]?: never };

export type FetchOptions<TFilter = string[]> = {
  search?: string;
  filter?: TFilter;
} & FetchPaginationOptions;

// Partial response type
export interface InstitutionsResponse {
  readonly number_of_results: number;
  readonly time_taken: number;
  readonly items: ReadonlyArray<{
    readonly id: string;
    readonly name: string;
    readonly email_address: string;
    readonly established: number;
    readonly types: string[];
    readonly links: string[];
    readonly aliases: string[];
    readonly acronyms: string[];
    readonly status: string;
    readonly wikipedia_url: string;
  }>;
}
