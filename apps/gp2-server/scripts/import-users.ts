import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import { GenericError } from '@asap-hub/errors';
import { gp2 } from '@asap-hub/model';
import { parse } from '@asap-hub/server-common';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../src/config';
import { ProjectContentfulDataProvider } from '../src/data-providers/contentful/project.data-provider';
import { UserContentfulDataProvider } from '../src/data-providers/contentful/user.data-provider';
import { WorkingGroupContentfulDataProvider } from '../src/data-providers/contentful/working-group.data-provider';
import { getContentfulRestClientFactory } from '../src/dependencies/clients.dependency';

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
const projectDataProvider = new ProjectContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);
const workingGroupDataProvider = new WorkingGroupContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);
const app = async () => {
  let numberOfImportedUsers = 0;
  let usersAlreadyExist = 0;
  let usersFailed = 0;

  const workingGroups = (await workingGroupDataProvider.fetch()).items;
  const projects = (await projectDataProvider.fetch({ skip: 0, take: 200 }))
    .items;
  const args = process.argv.slice(2);

  if (typeof args[0] !== 'string') {
    throw new Error('Please provide a path to the CSV file');
  }

  const filePath = args[0];

  const userCsvImport = parse(
    (
      input,
    ): gp2.UserCreateDataObject & {
      workingGroup?: gp2.WorkingGroupDataObject;
      project?: gp2.ProjectDataObject;
    } => {
      const data = input.map((s) => s.trim());
      const userWorkingGroup = workingGroups.find(
        (wg) => wg.title === data[10]!,
      );
      const userProject = projects.find((p) => p.title === data[16]!);
      return {
        firstName: data[0]!,
        lastName: data[1]!,
        country: data[4]!,
        email: data[2] || data[3]!,
        alternativeEmail: data[3]!,
        region: data[5] as gp2.UserRegion,
        positions: [
          {
            institution: data[6] || 'Unknown',
            department: data[7] || 'Unknown',
            role: data[8] || 'Unknown',
          },
        ],
        role: 'Network Collaborator',
        onboarded: true,
        degrees: [],
        fundingStreams: data[13]!,
        keywords: [],
        questions: [],
        contributingCohorts: [],
        workingGroup: userWorkingGroup,
        project: userProject,
      };
    },
    async ({ workingGroup, project, ...input }) => {
      try {
        const user = await userDataProvider.create(input);
        if (workingGroup) {
          workingGroupDataProvider.update(workingGroup.id, {
            members: [
              ...workingGroup.members,
              { userId: user, role: 'Working group member' },
            ],
          });
        }
        if (project) {
          projectDataProvider.update(project.id, {
            members: [
              ...project.members,
              { userId: user, role: 'Contributor' },
            ],
          });
        }
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
