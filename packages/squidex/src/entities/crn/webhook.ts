import { WebhookDetailType } from '@asap-hub/model';
import { Entity, Rest } from '../common';

export interface SquidexWebhookPayload<T> {
  type: WebhookDetailType;
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
