import Chance from 'chance';
import { Squidex } from '@asap-hub/squidex';
import { TeamRole, UserResponse, Invitee } from '@asap-hub/model';
import { RestTeam } from '@asap-hub/squidex';
import { CMSUser, parseUser } from '../../src/entities';

const users = new Squidex<CMSUser>('users');
const chance = new Chance();

export type TestUserResponse = UserResponse & {
  connections: ReadonlyArray<{ code: string }>;
};

function transform(user: CMSUser): TestUserResponse {
  return {
    ...parseUser(user),
    connections: user.data.connections.iv,
  };
}

export const createUser = (
  overwrites: Invitee | object = {},
): Promise<CMSUser> => {
  const data = {
    displayName: `${chance.first()} ${chance.last()}`,
    firstName: chance.first(),
    lastName: chance.last(),
    jobTitle: chance.suffix({ full: true }),
    orcid: chance.ssn(),
    institution: chance.company(),
    email: chance.email(),
    biography: chance.paragraph({ sentence: 3 }),
    location: chance.city(),
    ...overwrites,
  };

  const user: CMSUser['data'] = {
    lastModifiedDate: { iv: `${new Date().toISOString()}` },
    displayName: { iv: data.displayName },
    email: { iv: data.email },
    firstName: { iv: data.firstName },
    lastName: { iv: data.lastName },
    jobTitle: { iv: data.jobTitle },
    orcid: { iv: data.orcid },
    institution: { iv: data.institution },
    location: { iv: data.location },
    role: { iv: 'Guest' },
    connections: {
      iv: [
        {
          code: chance.ssn(),
        },
      ],
    },
  };

  return users.create(user);
};

export const createRandomUser = async (
  overwrites: Invitee | object = {},
): Promise<TestUserResponse> => {
  const createdUser = await createUser(overwrites);
  return transform(createdUser);
};

export const createUserOnTeam = async (
  team: RestTeam,
  role: TeamRole | null = null,
): Promise<TestUserResponse> => {
  const createdUser = await createUser();
  const teams = [
    {
      role:
        role ||
        chance.pickone([
          'Lead PI',
          'Co-Investigator',
          'Project Manager',
          'Collaborator',
          'Key Personnel',
        ]),
      id: [team.id],
    },
  ];

  const user = await users.patch(createdUser.id, {
    email: { iv: createdUser.data.email.iv },
    teams: { iv: teams },
  });

  return transform(user);
};
