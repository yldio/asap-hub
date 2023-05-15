import { GenericError } from '@asap-hub/errors';
import { gp2 as gp2Model } from '@asap-hub/model';
import { parse } from '@asap-hub/server-common';
import {
  getAccessTokenFactory,
  gp2 as gp2Squidex,
  SquidexGraphql,
  SquidexRest,
} from '@asap-hub/squidex';
import { appName, baseUrl, clientId, clientSecret } from '../src/config';
import { ContributingCohortSquidexDataProvider } from '../src/data-providers/contributing-cohort.data-provider';

console.log('Importing contributing cohorts...');

const getAuthToken = getAccessTokenFactory({
  clientId,
  clientSecret,
  baseUrl,
});
const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
  appName,
  baseUrl,
});
const contributingCohortRestClient = new SquidexRest<
  gp2Squidex.RestContributingCohort,
  gp2Squidex.InputContributingCohort
>(getAuthToken, 'contributing-cohorts', {
  appName,
  baseUrl,
});
const contributingCohortDataProvider =
  new ContributingCohortSquidexDataProvider(
    squidexGraphqlClient,
    contributingCohortRestClient,
  );
const app = async () => {
  let imported = 0;
  let alreayExist = 0;
  let failed = 0;

  const args = process.argv.slice(2);

  if (typeof args[0] !== 'string') {
    throw new Error('Please provide a path to the CSV file');
  }

  const filePath = args[0];

  const csvImport = parse(
    (input): gp2Model.ContributingCohortCreateDataObject => {
      const data = input.map((s) => s.trim());
      return {
        name: data[0]!,
      };
    },
    async (input) => {
      try {
        await contributingCohortDataProvider.create(input);
        imported++;
      } catch (e) {
        if (
          e &&
          typeof e === 'object' &&
          'details' in e &&
          Array.isArray((e as any).details)
        ) {
          if (
            (e as any).details[0].includes(
              'name.iv: Another content with the same value exists.',
            )
          ) {
            alreayExist++;
            return;
          }
        }

        failed++;
        if (e instanceof GenericError) {
          if (
            typeof e.httpResponseBody === 'string' &&
            e.httpResponseBody.includes('Validation error')
          ) {
            console.log(
              `Validation error(s):\n` +
                `- ${(e as any).details.join('\n- ')}\n` +
                `Input: ${Object.entries(input)
                  .map(
                    ([k, v]) =>
                      `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`,
                  )
                  .join(', ')}\n\n`,
            );
            return;
          }
          console.log(JSON.stringify(e, null, 2));
        }
        console.log({ input, e });
      }
    },
  );

  await csvImport(filePath);

  console.log(
    `Imported ${imported} cohorts, already exist ${alreayExist}, failed ${failed}`,
  );
};

app().catch(console.error);
