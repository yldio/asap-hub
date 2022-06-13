/* istanbul ignore file */
import { ResearchOutputSharingStatus, DecisionOption } from '@asap-hub/model';
import { RestResearchOutput, Results, SquidexRest } from '@asap-hub/squidex';
import { appName, baseUrl } from '../config';
import { Migration } from '../handlers/webhooks/webhook-run-migrations';
import { getAuthToken } from '../utils/auth';

// The results we get from the squidex might not have the default values yet
type OldRestResearchOutput = Omit<
  RestResearchOutput,
  'sharingStatus' | 'asapFunded' | 'usedInAPublication'
> & {
  sharingStatus?: RestResearchOutput['data']['sharingStatus'];
  asapFunded?: RestResearchOutput['data']['asapFunded'];
  usedInAPublication?: RestResearchOutput['data']['usedInAPublication'];
};

export default class SetResearchOutputDefaultFields extends Migration {
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
    let result: Results<OldRestResearchOutput>;

    do {
      result = await squidexClient.fetch({
        $top: 10,
        $skip: pointer,
        $orderby: 'created asc',
      });

      for (const researchOutput of result.items as OldRestResearchOutput[]) {
        const { sharingStatus, asapFunded, usedInAPublication } =
          researchOutput.data;

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
      }

      pointer += 10;
    } while (pointer < result.total);
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  down = async (): Promise<void> => {};
}
