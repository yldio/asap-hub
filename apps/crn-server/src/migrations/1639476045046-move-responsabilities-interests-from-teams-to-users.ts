/* istanbul ignore file */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Migration } from '@asap-hub/server-common';
import { RestUser } from '@asap-hub/squidex';
import { applyToAllItemsInCollection } from '../utils/migrations';

export default class AddDefaultOnboardedFieldsToUser extends Migration {
  up = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestUser>(
      'users',
      async (user, squidexClient) => {
        await squidexClient.patch(user.id, {
          researchInterests: {
            iv:
              (
                user.data.teams.iv?.find(
                  (team) => !!(team as any).mainResearchInterests?.length,
                ) as any
              ).mainResearchInterests ?? '',
          },
          responsibilities: {
            iv:
              (
                user.data.teams.iv?.find(
                  (team) => !!(team as any).responsibilities?.length,
                ) as any
              ).responsibilities ?? '',
          },
        });
      },
    );
  };
  down = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestUser>(
      'users',
      async (user, squidexClient) => {
        await squidexClient.patch(user.id, {
          researchInterests: {
            iv: '',
          },
          responsibilities: {
            iv: '',
          },
        });
      },
    );
  };
}
