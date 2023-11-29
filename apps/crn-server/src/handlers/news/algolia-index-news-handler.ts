import { AlgoliaClient, algoliaSearchClientFactory } from '@asap-hub/algolia';
import { NewsEvent, NewsResponse } from '@asap-hub/model';
import { EventBridgeHandler, NewsPayload } from '@asap-hub/server-common';
import { NotFoundError } from '@asap-hub/errors';
import { Boom, isBoom } from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import NewsController from '../../controllers/news.controller';
import { getNewsDataProvider } from '../../dependencies/news.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { addTagsFunction } from '../helper';

/* istanbul ignore next */
export const indexNewsHandler =
  (
    newsController: NewsController,
    algoliaClient: AlgoliaClient<'crn'>,
  ): EventBridgeHandler<NewsEvent, NewsPayload> =>
  async (event) => {
    const eventType = event['detail-type'];

    const newsId = event.detail.resourceId;
    logger.debug(`Event ${eventType}`);

    const eventHandlers = {
      NewsPublished: async () => {
        try {
          const news = await newsController.fetchById(newsId);

          logger.debug(`Fetched news ${newsId}`);

          if (news) {
            await algoliaClient.save({
              data: addTagsFunction(news) as NewsResponse,
              type: 'news',
            });

            logger.debug(`News saved ${newsId}`);
          }
        } catch (e) {
          if (
            (isBoom(e) && (e as Boom).output.statusCode === 404) ||
            e instanceof NotFoundError
          ) {
            await algoliaClient.remove(newsId);

            logger.debug(`News removed ${newsId}`);
            return;
          }

          logger.error(e, 'Error saving news to Algolia');
          throw e;
        }
      },
      NewsUnpublished: async () => {
        await algoliaClient.remove(newsId);

        logger.debug(`News removed ${newsId}`);
      },
    };

    await eventHandlers[eventType]();
  };

/* istanbul ignore next */
export const handler = sentryWrapper(
  indexNewsHandler(
    new NewsController(getNewsDataProvider()),
    algoliaSearchClientFactory({ algoliaApiKey, algoliaAppId, algoliaIndex }),
  ),
);

export type NewsIndexEventBridgeEvent = EventBridgeEvent<
  NewsEvent,
  NewsPayload
>;
