import Chance from 'chance';
import {
  UserResponse,
  ResearchOutputCreationRequest,
  Invitee,
} from '@asap-hub/model';
import { CMS } from '../../src/cms';
import { CMSTeam } from '../../src/entities/team';
import { CMSUser } from '../../src/entities/user';

const chance = new Chance();
const cms = new CMS();

type TestUserResponse = UserResponse & {
  connections: ReadonlyArray<{ code: string }>;
};

function transform(user: CMSUser): TestUserResponse {
  return {
    id: user.id,
    displayName: user.data.displayName.iv,
    email: user.data.email.iv,
    firstName: user.data.firstName && user.data.firstName.iv,
    middleName: user.data.middleName && user.data.middleName.iv,
    lastName: user.data.lastName && user.data.lastName.iv,
    jobTitle: user.data.jobTitle && user.data.jobTitle.iv,
    orcid: user.data.orcid && user.data.orcid.iv,
    institution: user.data.institution && user.data.institution.iv,
    teams: user.data.teams,
    connections: user.data.connections.iv,
  };
}

export const createUser = (): Promise<CMSUser> => {
  const user: Invitee = {
    displayName: `${chance.first()} ${chance.last()}`,
    firstName: chance.first(),
    middleName: chance.last(),
    lastName: chance.last(),
    jobTitle: chance.suffix({ full: true }),
    orcid: chance.ssn(),
    institution: chance.company(),
    email: chance.email(),
  };

  return cms.users.create(user);
};

export const createRandomUser = async (): Promise<TestUserResponse> => {
  const createdUser = await createUser();
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
  const createdUser = await createUser();
  const user = await cms.users.addToTeam(createdUser, chance.string(), team);
  return transform(user);
};
