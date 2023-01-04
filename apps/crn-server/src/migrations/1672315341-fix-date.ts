/* istanbul ignore file */
import { RestUser } from '@asap-hub/squidex';
import { Migration } from '@asap-hub/server-common';
import { applyToAllItemsInCollection } from '../utils/migrations';

export default class FixUserDate extends Migration {
  up = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestUser>(
      'users',
      async (user, squidexClient) => {
        if (user.data.lastModifiedDate?.iv) {
          const date = new Date(user.data.lastModifiedDate.iv);
          if (date instanceof Date && !Number.isNaN(date.getTime())) {
            // eslint-disable-next-line no-console
            console.log(
              `Parsed ${user.id} with lastModifiedDate: "${
                user.data.lastModifiedDate.iv
              }" to "${date.toISOString()}"`,
            );

            await squidexClient.patch(user.id, {
              lastModifiedDate: {
                iv: date.toISOString(),
              },
            });
          } else {
            // eslint-disable-next-line no-console
            console.log(
              `Could not parse ${user.id} with lastModifiedDate: "${user.data.lastModifiedDate.iv}"`,
            );
          }
        }
      },
    );
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  down = async (): Promise<void> => {};
}
