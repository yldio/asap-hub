/* istanbul ignore file */
import { RestResearchOutput, Results, SquidexRest } from '@asap-hub/squidex';
import { Migration } from '../handlers/webhooks/webhook-run-migrations';

export default class MoveResearchOutputTextToDescription extends Migration {
  up = async (): Promise<void> => {
    const squidexClient = new SquidexRest<RestResearchOutput>(
      'research-outputs',
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
          description: (researchOutput.data as any).text,
        });
      }

      pointer += 10;
    } while (pointer < result.total);
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  down = async (): Promise<void> => {};
}
