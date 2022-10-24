/* istanbul ignore file */
import { RestResearchOutput } from '@asap-hub/squidex';
import {
  ResearchOutputType,
  ResearchOutputDocumentType,
} from '@asap-hub/model';

import { Migration } from '@asap-hub/server-common';
import { applyToAllItemsInCollection } from '../utils/migrations';

export default class MoveResearchOutputTextToDescription extends Migration {
  up = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestResearchOutput>(
      'research-outputs',
      async (researchOutput, squidexClient) => {
        if (
          // @ts-expect-error type definition has changed
          researchOutput.data.type.iv ===
          ('Proposal' as unknown as ResearchOutputDocumentType)
        ) {
          await squidexClient.patch(researchOutput.id, {
            // @ts-expect-error type definition has changed
            type: { iv: 'Grant Document' },
            // @ts-expect-error type definition has changed
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
        // @ts-expect-error type definition has changed
        if (researchOutput.data.type.iv === 'Grant Document') {
          await squidexClient.patch(researchOutput.id, {
            // @ts-expect-error type definition has changed
            type: { iv: 'Proposal' as unknown as ResearchOutputDocumentType },
            // @ts-expect-error type definition has changed
            subtype: null as unknown as { iv: ResearchOutputType },
          });
        }
      },
    );
  };
}
