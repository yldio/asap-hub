import { WebhookDetailType } from '@asap-hub/model';
import { Entity, Rest } from '../common';

export interface SquidexWebhookPayload<
  TEntity,
  TWebhookDetailType extends WebhookDetailType = WebhookDetailType,
> {
  type: TWebhookDetailType;
  timestamp: string;
  payload: Entity &
    Rest<TEntity> & {
      type: string;
      $type: string;
      data: Rest<TEntity>['data'];
      dataOld?: Rest<TEntity>['data'];
      [key: string]: string | number | unknown;
    };
}
