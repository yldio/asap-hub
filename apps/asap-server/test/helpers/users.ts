import Chance from 'chance';
import { Squidex } from '@asap-hub/squidex';
import { TeamRole, UserResponse, Invitee } from '@asap-hub/model';
import { RestTeam, RestUser } from '@asap-hub/squidex';
import { parseUser } from '../../src/entities';

const users = new Squidex<RestUser>('users');
const chance = new Chance();

export type TestUserResponse = UserResponse & {
  connections: ReadonlyArray<{ code: string }>;
};

function transform(user: RestUser): TestUserResponse {
  return {
    ...parseUser(user),
    connections: user.data.connections.iv,
  };
}

export const createUser = (
  overwrites: Invitee | object = {},
): Promise<RestUser> => {
  const data = {
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

  const user: RestUser['data'] = {
    lastModifiedDate: { iv: `${new Date().toISOString()}` },
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
    avatar: { iv: [] },
    skills: { iv: [] },
    questions: { iv: [] },
    teams: { iv: [] },
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
        (chance.pickone([
          'Lead PI (Core Leadership)',
          'Co-PI (Core Leadership)',
          'Collaborating PI',
          'Project Manager',
          'Key Personnel',
          'Guest',
          'Staff',
          'Advisor',
        ]) as TeamRole),
      id: [team.id],
    },
  ];

  const user = await users.patch(createdUser.id, {
    email: { iv: createdUser.data.email.iv },
    teams: { iv: teams },
  });

  return transform(user);
};
