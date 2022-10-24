/* istanbul ignore file */
import { Migration } from '@asap-hub/server-common';
import { RestUser } from '@asap-hub/squidex';
import { applyToAllItemsInCollection } from '../utils/migrations';

export default class MoveResearchOutputTextToDescription extends Migration {
  // eslint-disable-next-line class-methods-use-this
  up = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestUser>(
      'users',
      async (user, squidexClient) => {
        await squidexClient.patch(user.id, { onboarded: { iv: true } });
      },
    );
  };
  // eslint-disable-next-line class-methods-use-this
  down = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestUser>(
      'users',
      async (user, squidexClient) => {
        await squidexClient.patch(user.id, { onboarded: undefined });
      },
    );
  };
}
