/* istanbul ignore file */
import { Migration } from '@asap-hub/server-common';
import { RestUser } from '@asap-hub/squidex';
import { applyToAllItemsInCollection } from '../utils/migrations';

export default class AddDefaultTeamStatusToUser extends Migration {
  up = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestUser>(
      'users',
      async (user, squidexClient) => {
        if (user.data.teams?.iv) {
          await squidexClient.patch(user.id, {
            teams: {
              iv: user.data.teams.iv.map((v) => ({
                ...v,
                status: 'Active',
              })),
            },
          });
        }
      },
    );
  };
  down = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestUser>(
      'users',
      async (user, squidexClient) => {
        if (user.data.teams?.iv) {
          await squidexClient.patch(user.id, {
            teams: {
              iv: user.data.teams.iv.map((v) => ({
                ...v,
                status: undefined,
              })),
            },
          });
        }
      },
    );
  };
}
