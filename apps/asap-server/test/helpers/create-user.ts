import Chance from 'chance';
import {
  UserResponse,
  ResearchOutputCreationRequest,
  Invitee,
} from '@asap-hub/model';
import { CMS } from '../../src/cms';
import { CMSTeam } from '../../src/entities/team';
import { CMSUser } from '../../src/entities/user';
import { transform as defaultTransform } from '../../src/controllers/users';

const chance = new Chance();
const cms = new CMS();

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
  const user: Invitee = {
    displayName: `${chance.first()} ${chance.last()}`,
    firstName: chance.first(),
    middleName: chance.last(),
    lastName: chance.last(),
    jobTitle: chance.suffix({ full: true }),
    orcid: chance.ssn(),
    institution: chance.company(),
    email: chance.email(),
    biography: chance.paragraph({ sentence: 3 }),
    avatarURL: chance.url(),
    skills: [chance.word()],
    ...overwrites,
  };

  return cms.users.create(user);
};

export const createRandomUser = async (
  overwrites: Invitee | object = {},
): Promise<TestUserResponse> => {
  const createdUser = await createUser(overwrites);
  return transform(createdUser);
};

export const createRandomOutput = async (user: string): Promise<void> => {
  const output: ResearchOutputCreationRequest = {
    url: chance.url(),
    doi: chance.string(),
    type: chance.pickone([
      'dataset',
      'code',
      'protocol',
      'resource',
      'preprint',
      'other',
    ]),
    title: chance.sentence(),
    description: chance.paragraph(),
    accessLevel: chance.pickone(['private', 'team', 'public']),
    authors: [
      {
        displayName: chance.name(),
      },
    ],
    publishDate: '2020-02-02T12:00:00Z',
  };

  await cms.researchOutputs.create(user, 'test', output);
};

export const createUserOnTeam = async (
  team: CMSTeam,
): Promise<UserResponse> => {
  const createdUser = await createUser({});
  const user = await cms.users.addToTeam(createdUser, chance.word(), team);
  return transform(user);
};
