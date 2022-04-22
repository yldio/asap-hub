/* istanbul ignore file */
import { RestResearchOutput } from '@asap-hub/squidex';
import { MigrationModule } from '../handlers/webhooks/webhook-run-migrations';
import { applyToAllItemsInCollection } from '../utils/migrations';

const MoveResearchOutputTypeFieldIntoDocumentType: MigrationModule = (
  filePath: string,
) => ({
  up: async () => {
    await applyToAllItemsInCollection<RestResearchOutput>(
      'research-outputs',
      async (researchOutput, squidexClient) => {
        await squidexClient.patch(researchOutput.id, {
          documentType: {
            // @ts-expect-error type definition has changed
            iv: researchOutput.data.type.iv,
          },
        });
      },
    );
  },

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  down: async () => {},
  getPath: () => filePath,
});

export default MoveResearchOutputTypeFieldIntoDocumentType;
