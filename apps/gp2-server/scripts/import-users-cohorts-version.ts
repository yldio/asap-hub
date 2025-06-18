import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import { gp2 } from '@asap-hub/model';
import { parse } from '@asap-hub/server-common';
import { RateLimiter } from 'limiter';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../src/config';
import { UserContentfulDataProvider } from '../src/data-providers/user.data-provider';
import { ContributingCohortContentfulDataProvider } from '../src/data-providers/contributing-cohort.data-provider';
import { getContentfulRestClientFactory } from '../src/dependencies/clients.dependency';

type UserCsvImportData = {
  firstName: string;
  middleName: string;
  lastName: string;
  city: string;
  country: string;
  region: gp2.UserRegion;
  email: string;
  positions: {
    institution: string;
    department: string;
    role: string;
  }[];
  role: gp2.UserRole;
  cohortId: string;
  cohortRole: gp2.UserContributingCohortRole;
  alternativeEmail?: string;
};

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
const cohortDataProvider = new ContributingCohortContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);

/**
 * This script imports users into Contentful given a CSV File with the format
 * https://asapparkinson-roadmap.slack.com/files/U078WPKMLS0/F092GUDQUTA/gp2_banner_authorship_list_-_member_details_final_to_upload__2___1_.xlsx.
 *
 * To run this script, use the following command from @asap-hub/gp2-server folder:
 *
 * CONTENTFUL_ACCESS_TOKEN=*** CONTENTFUL_SPACE_ID=*** CONTENTFUL_ENV_ID=*** CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=*** yarn import:users:cohorts-version [path-to-csv]
 *
 * Note: The CSV file should contain a header row.
 */

const app = async () => {
  let numberOfImportedUsers = 0;
  let usersAlreadyExist = 0;
  let usersFailed = 0;

  console.log(`starting import for ${contentfulEnvId}`);
  const rateLimiter = new RateLimiter({
    tokensPerInterval: 5,
    interval: 5000,
  });
  const cohorts = (await cohortDataProvider.fetch({ skip: 0, take: 200 }))
    .items;
  const args = process.argv.slice(2);

  if (typeof args[0] !== 'string') {
    throw new Error('Please provide a path to the CSV file');
  }
  const filePath = args[0];

  const userCsvImport = parse(
    (input): UserCsvImportData => {
      const data = input.map((s) => s.trim());

      const cohortName = data[7] ? data[7] : data[6];
      const cohort = cohorts.find((c) => c.name === cohortName);
      if (!cohort) {
        console.warn(`Cohort "${cohortName}" not found`);
      }

      return {
        firstName: data[3]!,
        middleName: data[4]!,
        lastName: data[5]!,
        city: data[12]!,
        country: data[13]!,
        region: data[14] as gp2.UserRegion,
        email: data[1]!,
        positions: [
          {
            institution: data[9] || 'Unknown',
            department: data[10] || 'Unknown',
            role: data[11] || 'Unknown',
          },
        ],
        cohortId: cohort!.id,
        role: data[17] as gp2.UserRole,
        cohortRole: data[8] as gp2.UserContributingCohortRole,
        alternativeEmail: data[15] || '',
      };
    },
    async (data: UserCsvImportData) => {
      try {
        const user = await userDataProvider.fetch({
          filter: {
            email: data.email,
          },
        });

        if (user.total > 0) {
          usersAlreadyExist++;
          console.log(`user already exists: ${data.email}`);
          return;
        }

        const contributingCohortData =
          data.cohortId && data.cohortRole
            ? [
                {
                  contributingCohortId: data.cohortId,
                  role: data.cohortRole,
                },
              ]
            : [];
        await rateLimiter.removeTokens(5);
        const userId = await userDataProvider.create({
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          city: data.city,
          country: data.country,
          region: data.region,
          email: data.email,
          role: data.role,
          positions: data.positions,
          contributingCohorts: contributingCohortData,
          onboarded: false,
          degrees: [],
          stateOrProvince: '',
          questions: [],
          alternativeEmail: data.alternativeEmail,
        });

        numberOfImportedUsers++;

        console.log(`imported user ${data.email} with id ${userId}`);
      } catch (e) {
        usersFailed++;

        console.error(e);
      }
    },
  );

  await userCsvImport(filePath);

  console.log(
    `Imported ${numberOfImportedUsers} users, already exist ${usersAlreadyExist}, failed ${usersFailed}`,
  );
};

app().catch(console.error);
