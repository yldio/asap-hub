/* istanbul ignore file */
import { Migration } from '@asap-hub/server-common';
import { RestNews } from '@asap-hub/squidex';
import { applyToAllItemsInCollection } from '../utils/migrations';

export default class MoveResearchOutputTextToDescription extends Migration {
  up = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestNews>(
      'news-and-events',
      async (news, squidexClient) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((news.data.type.iv as any) !== 'Training') return;

        await squidexClient.patch(news.id, {
          type: {
            iv: 'Tutorial',
          },
        });
      },
    );
  };
  down = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestNews>(
      'news-and-events',
      async (news, squidexClient) => {
        if (news.data.type.iv !== 'Tutorial') return;

        await squidexClient.patch(news.id, {
          type: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            iv: 'Training' as any,
          },
        });
      },
    );
  };
}
