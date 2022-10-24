/* istanbul ignore file */
import { RestNews, SquidexRest, RestTutorials } from '@asap-hub/squidex';
import { appName, baseUrl } from '../config';
import { Migration } from '@asap-hub/server-common';
import { getAuthToken } from '../utils/auth';
import { applyToAllItemsInCollection } from '../utils/migrations';

export default class MoveTypeTutorialNewsToEntityTutorials extends Migration {
  up = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestNews>(
      'news-and-events',
      async (news, squidexClient) => {
        if (news.data.type.iv !== 'Tutorial') {
          return;
        }

        const { title, shortText, text, link, linkText, thumbnail } = news.data;

        const squidexTutorialsClient = new SquidexRest<RestTutorials>(
          getAuthToken,
          'tutorials',
          { appName, baseUrl },
          {
            unpublished: true,
          },
        );

        await squidexTutorialsClient.create({
          title,
          shortText,
          text,
          link,
          linkText,
          thumbnail,
        });
        await squidexClient.delete(news.id);
      },
    );
  };

  down = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestTutorials>(
      'tutorials',
      async (tutorials, squidexClient) => {
        const squidexNewsClient = new SquidexRest<RestNews>(
          getAuthToken,
          'news-and-events',
          { appName, baseUrl },
          {
            unpublished: true,
          },
        );
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
