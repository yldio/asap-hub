import type {
  APIGatewayProxyHandlerV2,
  Context,
  EventBridgeEvent,
  ScheduledEvent,
} from 'aws-lambda';

export type Handler = APIGatewayProxyHandlerV2 &
  ((
    event: Parameters<APIGatewayProxyHandlerV2>[0],
    context?: Context,
  ) => ReturnType<APIGatewayProxyHandlerV2>);

export type FetchPaginationOptions = {
  take?: number;
  skip?: number;
};

export type FetchOptions = {
  search?: string;
  filter?: string[];
} & FetchPaginationOptions;

export type GraphqlFetchOptions = {
  top?: number;
  skip?: number;
  filter?: string;
  order?: string;
};

export type AllOrNone<T> = T | { [K in keyof T]?: never };

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
