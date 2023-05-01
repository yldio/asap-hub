/* istanbul ignore file */

import { Migration } from '@asap-hub/server-common';
import { RestResearchOutput } from '@asap-hub/squidex';
import { applyToAllItemsInCollection } from '../utils/migrations';

export default class RemoveWorkingGroupsFromNews extends Migration {
  up = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestResearchOutput>(
      'research-outputs',
      async (researchOutput, squidexClient) => {
        if (researchOutput.status === 'Draft') {
          await squidexClient.patch(researchOutput.id, {
            addedDate: { iv: '' },
          });
        }
      },
    );
  };
  down = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestResearchOutput>(
      'research-outputs',
      async (researchOutput, squidexClient) => {
        if (researchOutput.status === 'Draft') {
          await squidexClient.patch(researchOutput.id, {
            addedDate: { iv: researchOutput.created },
          });
        }
      },
    );
  };
}
