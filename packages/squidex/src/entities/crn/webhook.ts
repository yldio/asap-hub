import { Entity, Rest } from '../common';

export interface WebhookPayload<T> {
  type: string;
  timestamp: string;
  payload: Entity &
    Rest<T> & {
      type: string;
      $type: string;
      data: Rest<T>['data'];
      dataOld?: Rest<T>['data'];
      [key: string]: string | number | unknown;
    };
}
