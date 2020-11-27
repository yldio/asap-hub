export interface Entity {
  id: string;
  created: string;
  lastModified: string;
}

export interface Rest<T extends object> {
  data: {
    [K in keyof T]: null extends T[K]
      ? {
          iv: NonNullable<T[K]>;
        } | null
      : {
          iv: NonNullable<T[K]>;
        };
  };
}

export interface Graphql<T extends object> {
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
