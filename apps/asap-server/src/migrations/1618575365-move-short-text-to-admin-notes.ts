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
          adminNotes: (researchOutput.data as any).shortText,
        });
      }

      pointer += 10;
    } while (pointer < result.total);
  }
  async down(): Promise<void> {
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
          adminNotes: null as any, // types dont cover null values
        });
      }

      pointer += 10;
    } while (pointer < result.total);
  }
}
