import { AlgoliaClient, algoliaSearchClientFactory } from '@asap-hub/algolia';
import { NotFoundError } from '@asap-hub/errors';
import { gp2 as gp2Model } from '@asap-hub/model';
import { EventBridgeHandler, Logger } from '@asap-hub/server-common';
import { isBoom } from '@hapi/boom';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import NewsController from '../../controllers/news.controller';
import { NewsContentfulDataProvider } from '../../data-providers/news.data-provider';
import { getContentfulGraphQLClientFactory } from '../../dependencies/clients.dependency';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { NewsPayload } from '../event-bus';

export const indexNewsHandler =
  (
    newsController: NewsController,
    algoliaClient: AlgoliaClient<'gp2'>,
    log: Logger,
  ): EventBridgeHandler<gp2Model.NewsEvent, NewsPayload> =>
  async (event) => {
    log.debug(`Event ${event['detail-type']}`);

    const reindexNews = async (id: string) => {
      try {
        const news = await newsController.fetchById(id);
        log.debug(`Fetched news ${news.id}`);

        await algoliaClient.save({
          data: news,
          type: 'news',
        });

        log.debug(`Saved news ${news.id}`);

        return news;
      } catch (e) {
        log.error(e, `Error while reindexing news ${id}`);
        if (
          (isBoom(e) && e.output.statusCode === 404) ||
          e instanceof NotFoundError
        ) {
          log.error(`News ${id} not found`);
          await algoliaClient.remove(id);
        }
        throw e;
      }
    };

    try {
      await reindexNews(event.detail.resourceId);
    } catch (e) {
      log.error(e, `Error while reindexing news ${event.detail.resourceId}`);
      if (
        (isBoom(e) && e.output.statusCode === 404) ||
        e instanceof NotFoundError
      ) {
        return;
      }
      throw e;
    }
  };

const contentfulGraphQLClient = getContentfulGraphQLClientFactory();
const newsDataProvider = new NewsContentfulDataProvider(
  contentfulGraphQLClient,
);

export const handler = sentryWrapper(
  indexNewsHandler(
    new NewsController(newsDataProvider),
    algoliaSearchClientFactory({
      algoliaApiKey,
      algoliaAppId,
      algoliaIndex,
    }),
    logger,
  ),
);
