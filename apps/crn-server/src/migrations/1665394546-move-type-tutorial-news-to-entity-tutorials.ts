/* istanbul ignore file */
import { RestNews, SquidexRest, RestTutorials } from '@asap-hub/squidex';
import { appName, baseUrl } from '../config';
import { Migration } from '../handlers/webhooks/webhook-run-migrations';
import { getAuthToken } from '../utils/auth';
import { applyToAllItemsInCollection } from '../utils/migrations';

const squidexTutorialsClient = new SquidexRest<RestTutorials>(
  getAuthToken,
  'tutorials',
  { appName, baseUrl },
  {
    unpublished: true,
  },
);

const squidexNewsClient = new SquidexRest<RestNews>(
  getAuthToken,
  'tutorials',
  { appName, baseUrl },
  {
    unpublished: true,
  },
);

export default class MoveTypeTutorialNewsToEntityTutorials extends Migration {
  up = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestNews>(
      'news-and-events',
      async (news, squidexClient) => {
        if (
          news.data.type !== ('Tutorial' as unknown as RestNews['data']['type'])
        ) {
          return;
        }

        const {
          type: _type,
          frequency: _frequency,
          ...tutorialData
        } = news.data;

        await squidexTutorialsClient.create(tutorialData);
        await squidexClient.delete(news.id);
      },
    );
  };

  down = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestTutorials>(
      'tutorials',
      async (tutorials, squidexClient) => {
        await squidexNewsClient.create({
          ...tutorials.data,
          type: {
            iv: 'Tutorial',
          },
        });
        await squidexClient.delete(tutorials.id);
      },
    );
  };
}
