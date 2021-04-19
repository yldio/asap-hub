export interface Entity {
  id: string;
  created: string;
  lastModified: string;
}

export interface Rest<T> {
  data: {
    [K in keyof T]: null extends T[K]
      ? {
          iv: NonNullable<T[K]>;
        } | null
      : {
          iv: T[K] extends Array<any> ? T[K] | null : NonNullable<T[K]>;
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
