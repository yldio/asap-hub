/* istanbul ignore file */
import { Migration } from '@asap-hub/server-common';
import { RestUser } from '@asap-hub/squidex';
import { applyToAllItemsInCollection } from '../utils/migrations';

export default class AddDefaultOnboardedFieldsToUser extends Migration {
  up = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestUser>(
      'users',
      async (user, squidexClient) => {
        await squidexClient.patch(user.id, { onboarded: { iv: true } });
      },
    );
  };
  down = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestUser>(
      'users',
      async (user, squidexClient) => {
        await squidexClient.patch(user.id, { onboarded: undefined });
      },
    );
  };
}
