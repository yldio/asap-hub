/* istanbul ignore file */
import { RestResearchOutput } from '@asap-hub/squidex';
import { ResearchOutputSubtype } from '@asap-hub/model';

import { Migration } from '../handlers/webhooks/webhook-run-migrations';
import { applyToAllItemsInCollection } from '../utils/migrations';

export default class MoveResearchOutputTextToDescription extends Migration {
  up = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestResearchOutput>(
      'research-outputs',
      async (researchOutput, squidexClient) => {
        if (researchOutput.data.type.iv === 'Proposal') {
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
            type: { iv: 'Proposal' },
            subtype: null as unknown as { iv: ResearchOutputSubtype },
          });
        }
      },
    );
  };
}
