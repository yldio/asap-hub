import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import { GenericError } from '@asap-hub/errors';
import { gp2 } from '@asap-hub/model';
import { parse } from '@asap-hub/server-common';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../src/config';
import { UserContentfulDataProvider } from '../src/data-providers/contentful/user.data-provider';
import { getContentfulRestClientFactory } from '../src/dependencies/clients.dependencies';

console.log('Importing users...');

const contentfulGraphQLClient = getContentfulGraphQLClient({
  space: contentfulSpaceId,
  accessToken: contentfulAccessToken,
  environment: contentfulEnvId,
});

const userDataProvider = new UserContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);
const app = async () => {
  let numberOfImportedUsers = 0;
  let usersAlreadyExist = 0;
  let usersFailed = 0;

  const args = process.argv.slice(2);

  if (typeof args[0] !== 'string') {
    throw new Error('Please provide a path to the CSV file');
  }

  const filePath = args[0];

  const userCsvImport = parse(
    (input): gp2.UserCreateDataObject => {
      const data = input.map((s) => s.trim());
      return {
        firstName: data[1]!,
        lastName: data[2]!,
        country: data[5]!,
        email: data[3]!,
        region: data[6] as gp2.UserRegion,
        positions: [
          {
            institution: data[7]!,
            department: data[8]!,
            role: data[9]!,
          },
        ],
        role: 'Network Collaborator',
        onboarded: false,
        degrees: [data[10]! as gp2.UserDegree],
        keywords: [],
        questions: [],
        contributingCohorts: [],
      };
    },
    async (input) => {
      try {
        await userDataProvider.create(input);
        numberOfImportedUsers++;
      } catch (e) {
        if (
          e &&
          typeof e === 'object' &&
          'details' in e &&
          Array.isArray((e as any).details)
        ) {
          if (
            (e as any).details[0].includes(
              'email.iv: Another content with the same value exists.',
            )
          ) {
            usersAlreadyExist++;
            return;
          }
        }

        usersFailed++;
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

  await userCsvImport(filePath);

  console.log(
    `Imported ${numberOfImportedUsers} users, already exist ${usersAlreadyExist}, failed ${usersFailed}`,
  );
};

app().catch(console.error);
