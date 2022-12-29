/* istanbul ignore file */
import { RestUser } from '@asap-hub/squidex';
import { Migration } from '@asap-hub/server-common';
import { applyToAllItemsInCollection } from '../utils/migrations';
import logger from '../utils/logger';

export default class FixUserDate extends Migration {
  up = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestUser>(
      'users',
      async (user, squidexClient) => {
        if (user.data.lastModifiedDate?.iv) {
          const date = new Date(user.data.lastModifiedDate.iv);
          if (date instanceof Date && !Number.isNaN(date.getTime())) {
            await squidexClient.patch(user.id, {
              lastModifiedDate: {
                iv: date.toISOString(),
              },
            });
          } else {
            logger.error(
              `Could not parse ${user.id} with lastModifiedDate: ${user.data.lastModifiedDate.iv}`,
            );
          }
        }
      },
    );
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  down = async (): Promise<void> => {};
}
