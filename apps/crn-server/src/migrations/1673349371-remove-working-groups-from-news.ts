/* istanbul ignore file */
import { Migration } from '@asap-hub/server-common';
import { RestNews } from '@asap-hub/squidex';
import { applyToAllItemsInCollection } from '../utils/migrations';

export default class RemoveWorkingGroupsFromNews extends Migration {
  up = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestNews>(
      'news-and-events',
      async (news, squidexClient) => {
        if (news.data.type.iv === 'Working Groups') {
          await squidexClient.delete(news.id);
        }
      },
    );
  };
  down = async (): Promise<void> => {};
}
