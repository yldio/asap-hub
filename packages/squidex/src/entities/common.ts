export interface Entity {
  id: string;
  created: string;
  lastModified: string;
  version: number;
}

export interface Rest<T> {
  data: {
    [K in keyof T]: null extends T[K]
      ? {
          iv: NonNullable<T[K]>;
        } | null
      : {
          iv: T[K] extends Array<unknown> ? T[K] | null : NonNullable<T[K]>;
        };
  };
}

export interface RestPayload<T> {
  data: {
    [K in keyof T]: null extends T[K]
      ?
          | {
              iv: T[K];
            }
          | undefined
      : {
          iv: T[K] extends Array<unknown> ? T[K] | null : NonNullable<T[K]>;
        };
  };
}

export interface Graphql<T> {
  data?:
    | {
        [K in keyof T]: {
          iv: NonNullable<T[K]>;
        } | null;
      }
    | null;
  flatData:
    | {
        [K in keyof T]?: T[K] | null;
      }
    | null;
}

export type GraphqlWithTypename<T extends Graphql<unknown>, Y> = T & {
  __typename: Y;
};
