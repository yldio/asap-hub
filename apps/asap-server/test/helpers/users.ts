import Chance from 'chance';
import { SquidexRest, User } from '@asap-hub/squidex';
import { TeamRole, UserResponse, Invitee } from '@asap-hub/model';
import { RestTeam, RestUser } from '@asap-hub/squidex';
import { parseUser } from '../../src/entities';

const users = new SquidexRest<RestUser>('users');
const chance = new Chance();

export type TestUserResponse = UserResponse & {
  connections: ReadonlyArray<{ code: string }>;
};

function transform(user: RestUser): TestUserResponse {
  return {
    ...parseUser(user),
    connections: user.data.connections.iv || [],
  };
}

export const createUser = (overwrites?: Partial<User>): Promise<RestUser> => {
  const userData: User = {
    onboarded: true,
    firstName: chance.first(),
    lastName: chance.last(),
    jobTitle: chance.suffix({ full: true }),
    orcid: createRandomOrcid(),
    institution: chance.company(),
    email: chance.email(),
    biography: chance.paragraph({ sentence: 3 }),
    role: 'Grantee',
    avatar: [],
    expertiseAndResourceTags: [],
    questions: [],
    teams: [],
    connections: [],
    labs: [],
    ...overwrites,
  };

  const user = Object.entries(userData).reduce((acc, [key, value]) => {
    acc[key] = { iv: value };
    return acc;
  }, {} as { [key: string]: { iv: unknown } });

  return users.create(user as RestUser['data']);
};

export const createRandomUser = async (
  overwrites: Invitee | object = {},
): Promise<TestUserResponse> => {
  const createdUser = await createUser(overwrites);
  return transform(createdUser);
};

export const createRandomOrcid = () => {
  return (
    [
      chance.string({ length: 4, numeric: true }),
      chance.string({ length: 4, numeric: true }),
      chance.string({ length: 4, numeric: true }),
      chance.string({ length: 3, numeric: true }),
    ].join('-') + chance.string({ length: 1, pool: '0123456789X' })
  );
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
