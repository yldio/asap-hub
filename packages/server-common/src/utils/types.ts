import type { Context, EventBridgeEvent, ScheduledEvent } from 'aws-lambda';

export type GraphqlFetchOptions = {
  top?: number;
  skip?: number;
  filter?: string;
  order?: string;
};

export type ScheduledHandlerAsync = (
  event: EventBridgeEvent<'Scheduled Event', ScheduledEvent>,
  context: Context,
) => Promise<void>;

export type DeepWriteable<T> = {
  -readonly [P in keyof T]: DeepWriteable<T[P]>;
};

declare global {
  type Instant = string & { __type: 'SquidexDate' };
  type JsonScalar = Record<string, unknown> & { __type: 'JsonScalar' };
}

export type EventBridgeHandler<TDetailType extends string, TDetail> = (
  event: EventBridgeEvent<TDetailType, TDetail>,
) => Promise<void>;

export type NullableOptionalProperties<T> = {
  [P in keyof T]: Pick<T, P> extends Required<Pick<T, P>> ? T[P] : T[P] | null;
};

export type OpensearchDataType =
  | 'boolean'
  | 'float'
  | 'double'
  | 'integer'
  | 'object'
  | 'text'
  | 'keyword'
  | 'nested';

export type OpensearchFieldMapping = {
  type?: OpensearchDataType;
  analyzer?: string;
  search_analyzer?: string;
  fields?: {
    keyword?: {
      type: 'keyword';
    };
  };
  properties?: {
    [key: string]: OpensearchFieldMapping;
  };
};

export type OpensearchMapping = {
  mappings: {
    properties: {
      [fieldName: string]: OpensearchFieldMapping;
    };
  };
};

export type OpensearchMetricConfig = {
  indexAlias: string;
  mapping: OpensearchMapping['mappings'];
};

export type AliasAction = {
  add?: {
    index: string;
    alias: string;
  };
  remove?: {
    index: string;
    alias: string;
  };
};
