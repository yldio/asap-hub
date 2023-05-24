import { GenericError } from '@asap-hub/errors';
import { gp2 } from '@asap-hub/model';
import { parse } from '@asap-hub/server-common';
import {
  getAccessTokenFactory,
  gp2 as gp2squidex,
  SquidexGraphql,
  SquidexRest,
} from '@asap-hub/squidex';
import { appName, baseUrl, clientId, clientSecret } from '../src/config';
import { ProjectSquidexDataProvider } from '../src/data-providers/project.data-provider';

import { UserSquidexDataProvider } from '../src/data-providers/user.data-provider';
import { WorkingGroupSquidexDataProvider } from '../src/data-providers/working-group.data-provider';

console.log('Importing users...');

const getAuthToken = getAccessTokenFactory({
  clientId,
  clientSecret,
  baseUrl,
});
const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
  appName,
  baseUrl,
});
const userRestClient = new SquidexRest<
  gp2squidex.RestUser,
  gp2squidex.InputUser
>(getAuthToken, 'users', {
  appName,
  baseUrl,
});
const userDataProvider = new UserSquidexDataProvider(
  squidexGraphqlClient,
  userRestClient,
);
const workingGroupRestClient = new SquidexRest<
  gp2squidex.RestWorkingGroup,
  gp2squidex.InputWorkingGroup
>(getAuthToken, 'working-groups', {
  appName,
  baseUrl,
});
const workingGroupDataProvider = new WorkingGroupSquidexDataProvider(
  squidexGraphqlClient,
  workingGroupRestClient,
);
const projectRestClient = new SquidexRest<
  gp2squidex.RestProject,
  gp2squidex.InputProject
>(getAuthToken, 'projects', {
  appName,
  baseUrl,
});
const projectDataProvider = new ProjectSquidexDataProvider(
  squidexGraphqlClient,
  projectRestClient,
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
        email: data[2]!,
        region: data[5] as gp2.UserRegion,
        positions: [
          {
            institution: data[6]!,
            department: data[7]!,
            role: data[8]!,
          },
        ],
        role: 'Network Collaborator',
        onboarded: false,
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
