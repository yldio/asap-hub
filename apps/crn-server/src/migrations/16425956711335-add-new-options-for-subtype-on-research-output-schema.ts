/* istanbul ignore file */
import { researchOutputMapType } from '@asap-hub/model';
import { RestResearchOutput } from '@asap-hub/squidex';
import { Migration } from '../handlers/webhooks/webhook-run-migrations';
import { applyToAllItemsInCollection } from '../utils/migrations';

export default class MapResearchOutputDeprecatedSubtype extends Migration {
  up = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestResearchOutput>(
      'research-outputs',
      async (researchOutput, squidexClient) => {
        const mappedSubtype = researchOutputMapType(
          // @ts-expect-error type definition has changed
          researchOutput.data?.subtype?.iv,
        );

        if (mappedSubtype) {
          await squidexClient.patch(researchOutput.id, {
            // @ts-expect-error type definition has changed
            subtype: { iv: mappedSubtype },
          });
        }
      },
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  down = async (): Promise<void> => {};
}
