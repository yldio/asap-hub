/* istanbul ignore file */
import { RestResearchOutput, Results, Squidex } from '@asap-hub/squidex';
import { Migration } from '../handlers/webhooks/webhook-run-migrations';
import logger from '../utils/logger';

export default class MoveResearchOutputTextToDescription extends Migration {
  up = async (): Promise<void> => {
    const squidexClient = new Squidex<RestResearchOutput>('research-outputs', {
      unpublished: true,
    });

    let pointer = 0;
    let result: Results<RestResearchOutput>;

    do {
      result = await squidexClient.fetch({
        $top: 10,
        $skip: pointer,
        $orderby: 'created asc',
      });

      for (const researchOutput of result.items) {
        const publishDate = researchOutput.data.publishDate?.iv;
        if (!publishDate) {
          continue;
        }

        try {
          const addedDate = publishDate.includes(' ')
            ? new Date(`${publishDate} UTC`).toISOString() // for dates in format 'Month Year'
            : new Date(publishDate).toISOString(); // For dates in ISO format

          await squidexClient.patch(researchOutput.id, {
            addedDate: { iv: addedDate },
          });
        } catch (err) {
          logger.error(err, `Error migrating RO: ${researchOutput.id}`);
          continue;
        }
      }

      pointer += 10;
    } while (pointer < result.total);
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  down = async (): Promise<void> => {};
}
