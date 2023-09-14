import { AlgoliaClient, algoliaSearchClientFactory } from '@asap-hub/algolia';
import { gp2 as gp2Model, ListResponse } from '@asap-hub/model';
import {
  loopOverCustomCollection,
  LoopOverCustomCollectionFetchOptions,
} from '@asap-hub/server-common';
import { EventBridgeEvent } from 'aws-lambda';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import EventController from '../../controllers/event.controller';
import { EventContentfulDataProvider } from '../../data-providers/event.data-provider';
import {
  getContentfulGraphQLClientFactory,
  getContentfulRestClientFactory,
} from '../../dependencies/clients.dependency';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { CalendarPayload } from '../event-bus';

export const indexCalendarEventsHandler =
  (
    eventController: EventController,
    algoliaClient: AlgoliaClient<'gp2'>,
  ): ((
    event: EventBridgeEvent<gp2Model.CalendarEvent, CalendarPayload>,
  ) => Promise<void>) =>
  async (event) => {
    logger.debug(`Event ${event['detail-type']}`);

    const fetchFunction = ({
      skip,
      take,
    }: LoopOverCustomCollectionFetchOptions): Promise<
      ListResponse<gp2Model.EventResponse>
    > =>
      eventController.fetch({
        skip,
        take,
        filter: { calendarId: event.detail.resourceId },
      });

    const processingFunction = async (
      foundEvents: ListResponse<gp2Model.EventResponse>,
    ) => {
      logger.info(
        `Found ${foundEvents.total} events. Processing ${foundEvents.items.length} events.`,
      );

      try {
        const events = foundEvents.items.map((data) => ({
          data,
          type: 'event' as const,
        }));
        logger.info(`trying to save: ${JSON.stringify(events, null, 2)}`);
        await algoliaClient.saveMany(events);
      } catch (err) {
        logger.error('Error occurred during saveMany');
        if (err instanceof Error) {
          logger.error(`The error message: ${err.message}`);
        }
        throw err;
      }

      logger.info(`Updated ${foundEvents.items.length} events.`);
    };

    await loopOverCustomCollection(fetchFunction, processingFunction, 8);
  };

const contentfulGraphQLClient = getContentfulGraphQLClientFactory();
const eventDataProvider = new EventContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);

export const handler = sentryWrapper(
  indexCalendarEventsHandler(
    new EventController(eventDataProvider),
    algoliaSearchClientFactory({
      algoliaApiKey,
      algoliaAppId,
      algoliaIndex,
    }),
  ),
);
