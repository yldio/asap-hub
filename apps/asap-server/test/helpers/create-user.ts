import Chance from 'chance';
import { UserResponse, Invitee } from '@asap-hub/model';
import { CMS } from '../../src/cms';
import { CMSTeam } from '../../src/entities/team';
import { CMSUser } from '../../src/entities/user';
import { transform as defaultTransform } from '../../src/controllers/users';
import { Squidex } from '@asap-hub/services-common';

const chance = new Chance();
const cms = new CMS();
const users = new Squidex<CMSUser>('users');

export type TestUserResponse = UserResponse & {
  connections: ReadonlyArray<{ code: string }>;
};

function transform(user: CMSUser): TestUserResponse {
  return {
    ...defaultTransform(user),
    connections: user.data.connections.iv,
  };
}

export const createUser = (
  overwrites: Invitee | object = {},
): Promise<CMSUser> => {
  const data = {
    displayName: `${chance.first()} ${chance.last()}`,
    firstName: chance.first(),
    middleName: chance.last(),
    lastName: chance.last(),
    jobTitle: chance.suffix({ full: true }),
    orcid: chance.ssn(),
    institution: chance.company(),
    email: chance.email(),
    biography: chance.paragraph({ sentence: 3 }),
    location: chance.city(),
    avatarURL: chance.url(),
    ...overwrites,
  };

  const user: CMSUser['data'] = {
    lastModifiedDate: { iv: `${new Date().toISOString()}` },
    displayName: { iv: data.displayName },
    email: { iv: data.email },
    firstName: { iv: data.firstName },
    middleName: { iv: data.middleName },
    lastName: { iv: data.lastName },
    jobTitle: { iv: data.jobTitle },
    orcid: { iv: data.orcid },
    institution: { iv: data.institution },
    location: { iv: data.location },
    avatarURL: { iv: data.avatarURL },
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
  team: CMSTeam,
  role: string | null = null,
): Promise<TestUserResponse> => {
  const createdUser = await createUser();
  const user = await cms.users.addToTeam(
    createdUser,
    role || chance.word(),
    team,
  );
  return transform(user);
};
