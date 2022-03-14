import { framework as lambda } from '@asap-hub/services-common';
import { Calendar, WebhookPayload } from '@asap-hub/squidex';
import { EventBridge } from 'aws-sdk';
import { eventBus, eventSource } from '../../config';
import logger from '../../utils/logger';
import { Handler } from '../../utils/types';
import validateRequest from '../../utils/validate-squidex-request';

export const calendarWebhookFactory = (eventBridge: EventBridge): Handler =>
  lambda.http(async (request: lambda.Request<WebhookPayload<Calendar>>) => {
    validateRequest(request);

    const type = getEventType(request.payload.type);

    if (!type) {
      logger.debug(`Event type "${request.payload.type}" not supported`);

      return {
        statusCode: 204,
      };
    }

    await eventBridge
      .putEvents({
        Entries: [
          {
            EventBusName: eventBus,
            Source: eventSource,
            DetailType: type,
            Detail: JSON.stringify(request.payload),
          },
        ],
      })
      .promise();

    return {
      statusCode: 200,
    };
  });

export type CalendarEventType = 'CalendarCreated' | 'CalendarUpdated';

const getEventType = (customType: string): CalendarEventType | undefined => {
  if (
    customType === 'CalendarsPublished' ||
    customType === 'CalendarsCreated'
  ) {
    return 'CalendarCreated';
  }

  if (customType === 'CalendarsUpdated') {
    return 'CalendarUpdated';
  }

  return undefined;
};

const eventBridge = new EventBridge();
export const handler: Handler = calendarWebhookFactory(eventBridge);
