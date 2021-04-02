import { RestResearchOutput, Results, Squidex } from '@asap-hub/squidex';
import { Migration } from '../handlers/webhooks/webhook-run-migrations';

export default class MoveResearchOutputTextToDescription implements Migration {
  up = async (): Promise<void> => {
    const squidexClient = new Squidex<RestResearchOutput>('research-outputs');

    let pointer = 0;
    let result: Results<RestResearchOutput>;

    do {
      result = await squidexClient.fetch({ $top: 10, $skip: pointer });

      for (const researchOuput of result.items) {
        await squidexClient.patch(researchOuput.id, {
          description: researchOuput.data.text,
        });
      }

      pointer += 10;
    } while (pointer < result.total);
  };

  down = async (): Promise<void> => {};
}
