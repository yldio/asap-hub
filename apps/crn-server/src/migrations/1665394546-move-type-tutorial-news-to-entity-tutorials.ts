/* istanbul ignore file */
import {
  RestNews,
  Results,
  SquidexRest,
  RestTutorials,
} from '@asap-hub/squidex';
import { appName, baseUrl } from '../config';
import { Migration } from '../handlers/webhooks/webhook-run-migrations';
import { getAuthToken } from '../utils/auth';

export default class MoveTypeTutorialNewsToEntityTutorials extends Migration {
  up = async (): Promise<void> => {
    const squidexNewsClient = new SquidexRest<RestNews>(
      getAuthToken,
      'news-and-events',
      { appName, baseUrl },
      {
        unpublished: true,
      },
    );

    const squidexTutorialsClient = new SquidexRest<RestTutorials>(
      getAuthToken,
      'tutorials',
      { appName, baseUrl },
      {
        unpublished: true,
      },
    );

    let pointer = 0;
    let result: Results<RestNews>;

    do {
      result = await squidexNewsClient.fetch({
        $top: 10,
        $skip: pointer,
        $orderby: 'created asc',
      });

      for (const news of result.items) {
        if (
          news.data.type !== ('Tutorial' as unknown as RestNews['data']['type'])
        ) {
          continue;
        }

        const { type, frequency, ...tutorialData } = news.data;

        try {
          await squidexTutorialsClient.create(tutorialData);
          await squidexNewsClient.delete(news.id);
        } catch (err) {
          console.log('error: ', err);
        }
      }

      pointer += 10;
    } while (pointer < result.total);
  };

  down = async (): Promise<void> => {};
}
