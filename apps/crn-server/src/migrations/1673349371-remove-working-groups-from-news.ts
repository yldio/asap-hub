/* istanbul ignore file */

import { Migration } from '@asap-hub/server-common';
import { RestNews } from '@asap-hub/squidex';
import { applyToAllItemsInCollection } from '../utils/migrations';

export default class RemoveWorkingGroupsFromNews extends Migration {
  up = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestNews>(
      'news-and-events',
      async (news, squidexClient) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (news.data.type.iv === 'Working Groups') {
          await squidexClient.delete(news.id);
        }
      },
    );
  };
  down = async (): Promise<void> => {
    // this is not needed
  };
}
