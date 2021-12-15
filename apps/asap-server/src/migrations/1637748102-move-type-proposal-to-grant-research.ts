/* istanbul ignore file */
import { ResearchOutputSubtype, ResearchOutputType } from '@asap-hub/model';

import { Migration } from '../handlers/webhooks/webhook-run-migrations';
import { applyToAllItemsInCollection } from '../utils/migrations';

export default class MoveResearchOutputTextToDescription extends Migration {
  up = async (): Promise<void> => {
    await applyToAllItemsInCollection('research-outputs')(
      async (researchOutput, squidexClient) => {
        if (
          researchOutput.data.type.iv ===
          ('Proposal' as unknown as ResearchOutputType)
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
    await applyToAllItemsInCollection('research-outputs')(
      async (researchOutput, squidexClient) => {
        if (researchOutput.data.type.iv === 'Grant Document') {
          await squidexClient.patch(researchOutput.id, {
            type: { iv: 'Proposal' as unknown as ResearchOutputType },
            subtype: null as unknown as { iv: ResearchOutputSubtype },
          });
        }
      },
    );
  };
}
