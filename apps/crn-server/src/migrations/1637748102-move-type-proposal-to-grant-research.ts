/* istanbul ignore file */
import { RestResearchOutput } from '@asap-hub/squidex';
import {
  ResearchOutputType,
  ResearchOutputDocumentType,
} from '@asap-hub/model';

import { Migration } from '../handlers/webhooks/webhook-run-migrations';
import { applyToAllItemsInCollection } from '../utils/migrations';

export default class MoveResearchOutputTextToDescription extends Migration {
  up = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestResearchOutput>(
      'research-outputs',
      async (researchOutput, squidexClient) => {
        if (
          researchOutput.data.type.iv ===
          ('Proposal' as unknown as ResearchOutputDocumentType)
        ) {
          await squidexClient.patch(researchOutput.id, {
            type: { iv: 'Grant Document' },
            subtype: { iv: 'Proposal' },
          });
        }
      },
    );
  };

  down = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestResearchOutput>(
      'research-outputs',
      async (researchOutput, squidexClient) => {
        if (researchOutput.data.type.iv === 'Grant Document') {
          await squidexClient.patch(researchOutput.id, {
            type: { iv: 'Proposal' as unknown as ResearchOutputDocumentType },
            subtype: null as unknown as { iv: ResearchOutputType },
          });
        }
      },
    );
  };
}
