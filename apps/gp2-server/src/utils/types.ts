import { EventBridgeEvent } from 'aws-lambda';

export type EventBridgeHandler<TDetailType extends string, TDetail> = (
  event: EventBridgeEvent<TDetailType, TDetail>,
) => Promise<void>;

export type NullableOptionalProperties<T> = {
  [P in keyof T]: Pick<T, P> extends Required<Pick<T, P>> ? T[P] : T[P] | null;
};
