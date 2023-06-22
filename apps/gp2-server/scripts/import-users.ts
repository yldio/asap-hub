import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import { GenericError } from '@asap-hub/errors';
import { gp2 } from '@asap-hub/model';
import { parse } from '@asap-hub/server-common';
import { RateLimiter } from 'limiter';
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

  console.log(`starting import for ${contentfulEnvId}`);
  const rateLimiter = new RateLimiter({
    tokensPerInterval: 5,
    interval: 5000,
  });
  const workingGroups = (await workingGroupDataProvider.fetch()).items;
  console.debug(`working groups ${JSON.stringify(workingGroups, null, 2)}`);
  const projects = (await projectDataProvider.fetch({ skip: 0, take: 20 }))
    .items;
  console.debug(`projects ${JSON.stringify(projects, null, 2)}`);
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
      const email = data[2] || data[3]!;
      const workingGroupTitle = data[10]!;
      const userWorkingGroup = workingGroups.find(
        (wg) => wg.title === workingGroupTitle,
      );
      if (workingGroupTitle.length > 0 && !userWorkingGroup) {
        console.warn(
          `Working group "${workingGroupTitle}" not found for ${email}`,
        );
      }
      const projectTitle = data[16]!;
      const userProject = projects.find((p) => p.title === projectTitle);
      if (projectTitle.length > 0 && !userProject) {
        console.warn(`Project "${projectTitle}" not found for ${email}`);
      }
      return {
        firstName: data[0]!,
        lastName: data[1]!,
        country: data[4]!,
        email,
        alternativeEmail: data[3] || undefined,
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
    async ({ workingGroup, project, ...user }) => {
      try {
        console.log(`about to create user: ${user.email}`);
        await rateLimiter.removeTokens(5);
        const userId = await userDataProvider.create(user);
        console.log(`created user: ${user.email} with id: ${userId}`);
        if (workingGroup) {
          console.log(
            `about to update working group ${workingGroup.title} for user: ${user.email}`,
          );
          await rateLimiter.removeTokens(5);
          await workingGroupDataProvider.update(workingGroup.id, {
            members: [
              ...workingGroup.members,
              { userId, role: 'Working group member' },
            ],
          });
          console.log(
            `updated working group ${workingGroup.title} for user: ${user.email}`,
          );
        }
        if (project) {
          console.log(
            `about to update project ${project.title} for user: ${user.email}`,
          );
          await rateLimiter.removeTokens(5);
          await projectDataProvider.update(project.id, {
            members: [...project.members, { userId, role: 'Contributor' }],
          });
          console.log(
            `updated project ${project.title} for user: ${user.email}`,
          );
        }
        numberOfImportedUsers++;
        console.log(
          `number of users imported so far: ${numberOfImportedUsers} `,
        );
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
            console.error(
              `Validation error(s):\n` +
                `- ${(e as any).details.join('\n- ')}\n` +
                `Input: ${Object.entries(user)
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
        console.log({ user, e });
      }
    },
  );

  await userCsvImport(filePath);

  console.log(
    `Imported ${numberOfImportedUsers} users, already exist ${usersAlreadyExist}, failed ${usersFailed}`,
  );
};

app().catch(console.error);
