/* istanbul ignore file */
import { ResearchOutputSharingStatus, DecisionOption } from '@asap-hub/model';
import { RestResearchOutput, Results, Squidex } from '@asap-hub/squidex';
import { Migration } from '../handlers/webhooks/webhook-run-migrations';
import logger from '../utils/logger';

// The results we get from the squidex might not have the default values yet
type OldRestResearchOutput = Omit<
  RestResearchOutput,
  'sharingStatus' | 'asapFunded' | 'usedInAPublication'
> & {
  sharingStatus?: RestResearchOutput['data']['sharingStatus'];
  asapFunded?: RestResearchOutput['data']['asapFunded'];
  usedInAPublication?: RestResearchOutput['data']['usedInAPublication'];
};

export default class MoveResearchOutputTextToDescription extends Migration {
  up = async (): Promise<void> => {
    const squidexClient = new Squidex<RestResearchOutput>('research-outputs', {
      unpublished: true,
    });

    let pointer = 0;
    let result: Results<OldRestResearchOutput>;

    do {
      result = await squidexClient.fetch({
        $top: 10,
        $skip: pointer,
        $orderby: 'created asc',
      });

      for (const researchOutput of result.items as OldRestResearchOutput[]) {
        try {
          const {
            sharingStatus,
            asapFunded,
            usedInAPublication,
          } = researchOutput.data;
          const defaults = {
            sharingStatus: {
              iv:
                sharingStatus?.iv ??
                ('Network Only' as ResearchOutputSharingStatus),
            },
            asapFunded: {
              iv: asapFunded?.iv ?? ('Not Sure' as DecisionOption),
            },
            usedInAPublication: {
              iv: usedInAPublication?.iv ?? ('Not Sure' as DecisionOption),
            },
          };

          await squidexClient.patch(researchOutput.id, defaults);
        } catch (err) {
          logger.error(err, `Error migrating RO: ${researchOutput.id}`);
          // eslint-disable-next-line no-continue
          continue;
        }
      }

      pointer += 10;
    } while (pointer < result.total);
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  down = async (): Promise<void> => {};
}
