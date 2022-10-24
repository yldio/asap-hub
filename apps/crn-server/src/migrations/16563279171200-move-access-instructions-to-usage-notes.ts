/* istanbul ignore file */
import { Migration } from '@asap-hub/server-common';
import { RestResearchOutput } from '@asap-hub/squidex';
import { applyToAllItemsInCollection } from '../utils/migrations';

export default class MoveResearchOutputUsageNotesToUsageNotes extends Migration {
  up = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestResearchOutput>(
      'research-outputs',
      async (researchOutput, squidexClient) => {
        await squidexClient.patch(researchOutput.id, {
          usageNotes: {
            // @ts-expect-error type definition has changed
            iv: researchOutput.data.accessInstructions?.iv || '',
          },
        });
      },
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  down = async (): Promise<void> => {};
}
