import { Entity, Rest } from './common';

export interface WebHookPayload<T> {
  type: string;
  payload: Entity & {
    type: string;
    $type: string;
    dataOld: Rest<T>;
    data: Rest<T>;
  };
}
