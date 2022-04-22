/* istanbul ignore file */
import { ResearchOutputType } from '@asap-hub/model';
import { RestResearchOutput } from '@asap-hub/squidex';
import { MigrationModule } from '../handlers/webhooks/webhook-run-migrations';
import { applyToAllItemsInCollection } from '../utils/migrations';

const MoveResearchOutputSubTypeFieldIntoType: MigrationModule = (
  filePath: string,
) => ({
  up: async () => {
    await applyToAllItemsInCollection<RestResearchOutput>(
      'research-outputs',
      async (researchOutput, squidexClient) => {
        await squidexClient.patch(researchOutput.id, {
          type: {
            iv:
              // @ts-expect-error type definition has changed
              researchOutput.data.subtype?.iv ||
              (null as unknown as ResearchOutputType),
          },
        });
      },
    );
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  down: async () => {},
  getPath: () => filePath,
});

export default MoveResearchOutputSubTypeFieldIntoType;
