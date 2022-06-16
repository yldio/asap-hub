/* istanbul ignore file */
import { RestResearchOutput, Results, SquidexRest } from '@asap-hub/squidex';
import { appName, baseUrl } from '../config';
import { Migration } from '../handlers/webhooks/webhook-run-migrations';
import { getAuthToken } from '../utils/auth';
import logger from '../utils/logger';

export default class MoveResearchOutputTextToDescription extends Migration {
  up = async (): Promise<void> => {
    const squidexClient = new SquidexRest<RestResearchOutput>(
      getAuthToken,
      'research-outputs',
      { appName, baseUrl },
      {
        unpublished: true,
      },
    );

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
          // eslint-disable-next-line no-continue
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
          // eslint-disable-next-line no-continue
          continue;
        }
      }

      pointer += 10;
    } while (pointer < result.total);
  };

  down = async (): Promise<void> => {
    const squidexClient = new SquidexRest<RestResearchOutput>(
      getAuthToken,
      'research-outputs',
      { appName, baseUrl },
      {
        unpublished: true,
      },
    );

    let pointer = 0;
    let result: Results<RestResearchOutput>;

    do {
      result = await squidexClient.fetch({
        $top: 10,
        $skip: pointer,
        $orderby: 'created asc',
      });

      for (const researchOutput of result.items) {
        await squidexClient.patch(researchOutput.id, {
          addedDate: { iv: null },
        } as unknown as { addedDate: { iv: string } }); // types dont cover null values
      }

      pointer += 10;
    } while (pointer < result.total);
  };
}
