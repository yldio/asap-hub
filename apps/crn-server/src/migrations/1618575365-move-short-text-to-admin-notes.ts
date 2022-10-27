/* istanbul ignore file */
import { Migration } from '@asap-hub/server-common';
import { RestResearchOutput, Results, SquidexRest } from '@asap-hub/squidex';
import { appName, baseUrl } from '../config';
import { getAuthToken } from '../utils/auth';

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
        await squidexClient.patch(researchOutput.id, {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          adminNotes: (researchOutput.data as any).shortText,
        });
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          adminNotes: null as any, // types dont cover null values
        });
      }

      pointer += 10;
    } while (pointer < result.total);
  };
}
