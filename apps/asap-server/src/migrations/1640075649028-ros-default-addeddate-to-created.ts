/* istanbul ignore file */
import { RestResearchOutput, Results, Squidex } from '@asap-hub/squidex';
import { Migration } from '../handlers/webhooks/webhook-run-migrations';

export default class MoveResearchOutputTextToDescription extends Migration {
  up = async (): Promise<void> => {
    const squidexClient = new Squidex<RestResearchOutput>('research-outputs');

    let pointer = 0;
    let result: Results<RestResearchOutput>;

    do {
      result = await squidexClient.fetch({
        $top: 10,
        $skip: pointer,
        $filter: `data/addedDate/iv eq ''`,
        $orderby: 'created asc',
      });

      for (const researchOutput of result.items) {
        await squidexClient.patch(researchOutput.id, {
          addedDate: {
            iv: researchOutput.created,
          },
        });
      }

      pointer += 10;
    } while (pointer < result.total);
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  down = async (): Promise<void> => {};
}
