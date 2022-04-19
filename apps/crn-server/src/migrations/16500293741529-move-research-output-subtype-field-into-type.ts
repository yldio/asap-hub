/* istanbul ignore file */
import { RestResearchOutput } from '@asap-hub/squidex';
import { ResearchOutputType } from '@asap-hub/model';
import { Migration } from '../handlers/webhooks/webhook-run-migrations';
import { applyToAllItemsInCollection } from '../utils/migrations';

export default class MoveResearchOutputSubTypeFieldIntoType extends Migration {
  up = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestResearchOutput>(
      'research-outputs',
      async (researchOutput, squidexClient) => {
        await squidexClient.patch(researchOutput.id, {
          type: {
            iv:
              researchOutput.data.subtype?.iv ||
              (null as unknown as ResearchOutputType),
          },
        });
      },
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  down = async (): Promise<void> => {};
}
