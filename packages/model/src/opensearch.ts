export interface OpensearchHit<T> {
  _index: string;
  _id: string;
  _score: number;
  _source: T;
}

export interface OpensearchHitsResponse<T> {
  hits: {
    total: {
      value: number;
    };
    hits: OpensearchHit<T>[];
  };
}
