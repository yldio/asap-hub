/* istanbul ignore file */
import { RestEvent } from '@asap-hub/squidex';
import { Migration } from '../handlers/webhooks/webhook-run-migrations';
import { applyToAllItemsInCollection } from '../utils/migrations';

export default class SetEventHideMeetingLinkDefault extends Migration {
  up = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestEvent>(
      'events',
      async (event, squidexClient) => {
        await squidexClient.patch(event.id, {
          hideMeetingLink: {
            iv: event.data.hideMeetingLink?.iv || false,
          },
        });
      },
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  down = async (): Promise<void> => {};
}
