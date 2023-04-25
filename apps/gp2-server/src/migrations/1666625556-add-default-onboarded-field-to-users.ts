/* istanbul ignore file */
import { Migration } from '@asap-hub/server-common';
import { gp2 as gp2squidex } from '@asap-hub/squidex';
import { applyToAllItemsInCollection } from '../utils/migrations';

export default class MoveResearchOutputTextToDescription extends Migration {
  up = async (): Promise<void> => {
    await applyToAllItemsInCollection<gp2squidex.RestUser>(
      'users',
      async (user, squidexClient) => {
        await squidexClient.patch(user.id, { onboarded: { iv: false } });
      },
    );
  };
  down = async (): Promise<void> => {
    await applyToAllItemsInCollection<gp2squidex.RestUser>(
      'users',
      async (user, squidexClient) => {
        await squidexClient.patch(user.id, { onboarded: { iv: false } });
        await squidexClient.patch(user.id, { onboarded: undefined });
      },
    );
  };
}
