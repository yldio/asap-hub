/* istanbul ignore file */
import { RestUser } from '@asap-hub/squidex';
import { Migration } from '../handlers/webhooks/webhook-run-migrations';
import { applyToAllItemsInCollection } from '../utils/migrations';

export default class MoveResearchOutputTextToDescription extends Migration {
  up = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestUser>(
      'users',
      async (user, squidexClient) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (user.data.degree?.iv === ('PhD, MD' as any)) {
          await squidexClient.patch(user.id, { degree: { iv: 'MD, PhD' } });
        }
      },
    );
  };
  down = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestUser>(
      'users',
      async (user, squidexClient) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (user.data.degree?.iv === ('MD, PhD' as any)) {
          await squidexClient.patch(user.id, {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            degree: { iv: 'PhD, MD' as any },
          });
        }
      },
    );
  };
}
