import { AlgoliaClient, algoliaSearchClientFactory } from '@asap-hub/algolia';
import { gp2 as gp2Model } from '@asap-hub/model';
import { EventBridgeHandler, Logger } from '@asap-hub/server-common';
import { isBoom } from '@hapi/boom';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import EventController from '../../controllers/event.controller';
import { EventContentfulDataProvider } from '../../data-providers/event.data-provider';
import {
  getContentfulGraphQLClientFactory,
  getContentfulRestClientFactory,
} from '../../dependencies/clients.dependency';
import logger from '../../utils/logger';
import { getTagsNames } from '../../utils/tag-names';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { EventPayload } from '../event-bus';

export const indexEventHandler =
  (
    eventController: EventController,
    algoliaClient: AlgoliaClient<'gp2'>,
    log: Logger,
  ): EventBridgeHandler<gp2Model.EventEvent, EventPayload> =>
  async (event) => {
    log.debug(`Event ${event['detail-type']}`);

    const reindexEvent = async (id: string) => {
      try {
        const calendarEvent = await eventController.fetchById(id);
        log.debug(`Fetched calendar event ${calendarEvent.id}`);

        const data = {
          ...calendarEvent,
          _tags: getTagsNames(calendarEvent.tags),
        };

        await algoliaClient.save({
          data,
          type: 'event',
        });

        log.debug(`Saved calendar event ${calendarEvent.id}`);

        return calendarEvent;
      } catch (e) {
        log.error(e, `Error while reindexing calendar event ${id}`);
        if (isBoom(e) && e.output.statusCode === 404) {
          log.error(`calendar event ${id} not found`);
          await algoliaClient.remove(id);
        }
        throw e;
      }
    };

    try {
      await reindexEvent(event.detail.resourceId);
    } catch (e) {
      log.error(
        e,
        `Error while reindexing calendar event ${event.detail.resourceId}`,
      );
      if (isBoom(e) && e.output.statusCode === 404) {
        return;
      }
      throw e;
    }
  };

const contentfulGraphQLClient = getContentfulGraphQLClientFactory();
const eventDataProvider = new EventContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);
export const handler = sentryWrapper(
  indexEventHandler(
    new EventController(eventDataProvider),
    algoliaSearchClientFactory({
      algoliaApiKey,
      algoliaAppId,
      algoliaIndex,
    }),
    logger,
  ),
);
