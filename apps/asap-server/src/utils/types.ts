import type {
  APIGatewayProxyHandler,
  Context,
  EventBridgeEvent,
  ScheduledEvent,
} from 'aws-lambda';

export type Handler = APIGatewayProxyHandler &
  ((
    event: Parameters<APIGatewayProxyHandler>[0],
    context?: Context,
  ) => ReturnType<APIGatewayProxyHandler>);

export type FetchPaginationOptions = {
  take?: number;
  skip?: number;
};

export type FetchOptions = {
  search?: string;
  filter?: string[];
} & FetchPaginationOptions;

export type AllOrNone<T> = T | { [K in keyof T]?: never };

export type ScheduledHandlerAsync = (
  event: EventBridgeEvent<'Scheduled Event', ScheduledEvent>,
  context: Context,
) => Promise<void>;
