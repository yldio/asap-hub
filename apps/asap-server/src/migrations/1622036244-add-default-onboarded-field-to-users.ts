/* istanbul ignore file */
import { Migration } from '../handlers/webhooks/webhook-run-migrations';
import { applyToAllItemsInCollection } from '../utils/migrations';

export default class AddDefaultOnboardedFieldsToUser extends Migration {
  up = async (): Promise<void> => {
    await applyToAllItemsInCollection('users')(async (user, squidexClient) => {
      await squidexClient.patch(user.id, { onboarded: { iv: true } });
    });
  };
  down = async (): Promise<void> => {
    await applyToAllItemsInCollection('users')(async (user, squidexClient) => {
      await squidexClient.patch(user.id, { onboarded: undefined });
    });
  };
}
