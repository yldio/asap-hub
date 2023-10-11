export interface ListResponse<T> {
  readonly total: number;
  readonly items: T[];
  readonly algoliaQueryId?: string;
  readonly algoliaIndexName?: string;
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

export const orcidWorkType = [
  'ANNOTATION',
  'ARTISTIC_PERFORMANCE',
  'BOOK_CHAPTER',
  'BOOK_REVIEW',
  'BOOK',
  'CONFERENCE_ABSTRACT',
  'CONFERENCE_PAPER',
  'CONFERENCE_POSTER',
  'DATA_SET',
  'DICTIONARY_ENTRY',
  'DISCLOSURE',
  'DISSERTATION',
  'EDITED_BOOK',
  'ENCYCLOPEDIA_ENTRY',
  'INVENTION',
  'JOURNAL_ARTICLE',
  'JOURNAL_ISSUE',
  'LECTURE_SPEECH',
  'LICENSE',
  'MAGAZINE_ARTICLE',
  'MANUAL',
  'NEWSLETTER_ARTICLE',
  'NEWSPAPER_ARTICLE',
  'ONLINE_RESOURCE',
  'OTHER',
  'PATENT',
  'PHYSICAL_OBJECT',
  'PREPRINT',
  'REGISTERED_COPYRIGHT',
  'REPORT',
  'RESEARCH_TECHNIQUE',
  'RESEARCH_TOOL',
  'SOFTWARE',
  'SPIN_OFF_COMPANY',
  'STANDARDS_AND_POLICY',
  'SUPERVISED_STUDENT_PUBLICATION',
  'TECHNICAL_STANDARD',
  'TEST',
  'TRADEMARK',
  'TRANSLATION',
  'WEBSITE',
  'WORKING_PAPER',
  'UNDEFINED',
] as const;
export type OrcidWorkType = (typeof orcidWorkType)[number];

export interface OrcidWork {
  id: string;
  doi?: string;
  title?: string;
  type: OrcidWorkType;
  publicationDate: {
    year?: string;
    month?: string;
    day?: string;
  };
  lastModifiedDate: string;
}
