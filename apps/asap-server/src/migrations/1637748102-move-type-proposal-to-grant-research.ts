/* istanbul ignore file */
import { RestResearchOutput, Results, Squidex } from '@asap-hub/squidex';
import { ResearchOutputSubtype } from '@asap-hub/model';

import { Migration } from '../handlers/webhooks/webhook-run-migrations';

interface Fetcher {
  (pointer: number): Promise<Results<RestResearchOutput>>;
}

interface ItemProcessor {
  (researchOutput: RestResearchOutput): unknown;
}

const fetchSquidex =
  (
    squidexClient: Squidex<RestResearchOutput>,
    type: 'Proposal' | 'Grant Document',
  ) =>
  (pointer: number) =>
    squidexClient.fetch({
      $top: 10,
      $skip: pointer,
      $orderby: 'created asc',
      $filter: `data/type/iv eq '${type}'`,
    });

const iterate = async (fetcher: Fetcher, process: ItemProcessor) => {
  let pointer = 0;
  let result: Results<RestResearchOutput>;

  do {
    result = await fetcher(pointer);

    for (const researchOutput of result.items) {
      await process(researchOutput);
    }

    pointer += 10;
  } while (pointer < result.total);
};

export default class MoveResearchOutputTextToDescription extends Migration {
  up = async (): Promise<void> => {
    const squidexClient = new Squidex<RestResearchOutput>('research-outputs');

    await iterate(fetchSquidex(squidexClient, 'Proposal'), (researchOutput) =>
      squidexClient.patch(researchOutput.id, {
        type: { iv: 'Grant Document' },
        subtype: { iv: 'Proposal' },
      }),
    );
  };

  down = async (): Promise<void> => {
    const squidexClient = new Squidex<RestResearchOutput>('research-outputs');

    await iterate(
      fetchSquidex(squidexClient, 'Grant Document'),
      (researchOutput) =>
        squidexClient.patch(researchOutput.id, {
          type: { iv: 'Proposal' },
          subtype: null as unknown as {iv: ResearchOutputSubtype}
        }),
    );
  };
}
