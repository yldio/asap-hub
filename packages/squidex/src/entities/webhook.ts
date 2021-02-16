import { Entity, Rest } from './common';

export interface WebhookPayload<T> {
  type: string;
  timestamp: string;
  payload: Entity &
    Rest<T> & {
      type: string;
      $type: string;
      dataOld?: Rest<T>['data'];
      [key: string]: string | number | unknown;
    };
}
