/* eslint-disable class-methods-use-this, @typescript-eslint/no-empty-function, no-empty-function */
/* istanbul ignore file */
import { RestResearchOutput, Results, Squidex } from '@asap-hub/squidex';
import { Migration } from '../handlers/webhooks/webhook-run-migrations';

export default class MoveResearchOutputTextToDescription extends Migration {
  async up(): Promise<void> {
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
        await squidexClient.patch(researchOutput.id, {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          description: (researchOutput.data as any).text,
        });
      }

      pointer += 10;
    } while (pointer < result.total);
  }

  async down(): Promise<void> {}
}
