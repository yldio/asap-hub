/* istanbul ignore file */
import { RestResearchOutput } from '@asap-hub/squidex';
import { Migration } from '../handlers/webhooks/webhook-run-migrations';
import { applyToAllItemsInCollection } from '../utils/migrations';

export default class MapResearchOutputDeprecatedSubtype extends Migration {
  up = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestResearchOutput>(
      'research-outputs',
      async (researchOutput, squidexClient) => {
        if (researchOutput?.data?.link?.iv === '') {
          await squidexClient.patch(researchOutput.id, {
            link: undefined,
          });
        }
      },
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  down = async (): Promise<void> => {};
}
