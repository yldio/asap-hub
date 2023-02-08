/* istanbul ignore file */
import { Migration } from '@asap-hub/server-common';
import { applyToAllItemsInCollection } from '../utils/migrations';

export default class SetResearchOutputPublishingEntityDefault extends Migration {
  up = async (): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await applyToAllItemsInCollection<any>(
      'research-outputs',
      async (researchOutput, squidexClient) => {
        await squidexClient.patch(researchOutput.id, {
          publishingEntity: {
            iv: 'Team',
          },
        });
      },
    );
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  down = async (): Promise<void> => {};
}
