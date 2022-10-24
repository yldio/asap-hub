/* istanbul ignore file */
import { Migration } from '@asap-hub/server-common';
import { RestResearchOutput } from '@asap-hub/squidex';
import { applyToAllItemsInCollection } from '../utils/migrations';

export default class MapResearchOutputDeprecatedSubtype extends Migration {
  up = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestResearchOutput>(
      'research-outputs',
      async (researchOutput, squidexClient) => {
        if (researchOutput?.data?.link?.iv?.trim() === '') {
          await squidexClient.patch(researchOutput.id, {
            link: {
              // @ts-expect-error // The type system does not support null here.
              // Changing the types is high effort because we would have to split
              // types for fetching data, where null cannot occur here, with types for patching data.
              iv: null,
            },
          });
        }
      },
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  down = async (): Promise<void> => {};
}
