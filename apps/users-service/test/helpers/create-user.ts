import Chance from 'chance';
import { CMS } from '../../src/cms';
import { ResearchOutput } from '@asap-hub/model';

const chance = new Chance();
const cms = new CMS();

function transform(user: User): ReplyUser {
  return {
    id: user.id,
    displayName: user.data.displayName.iv,
    connections: user.data.connections.iv,
    email: user.data.email.iv,
    firstName: user.data.firstName && user.data.firstName.iv,
    middleName: user.data.middleName && user.data.middleName.iv,
    lastName: user.data.lastName && user.data.lastName.iv,
    title: user.data.title && user.data.title.iv,
    orcid: user.data.orcid && user.data.orcid.iv,
    institution: user.data.institution && user.data.institution.iv,
  } as ReplyUser;
}

export const createRandomUser = async (): ReplyUser => {
  const user = {
    displayName: `${chance.first()} ${chance.last()}`,
    firstName: chance.first(),
    middleName: chance.last(),
    lastName: chance.last(),
    title: chance.suffix({ full: true }),
    orcid: chance.ssn(),
    institution: chance.company(),
    email: chance.email(),
  };

  const createdUser = await cms.users.create(user);
  return transform(createdUser);
};

export const createRandomOutput = async (user: String): ReplyUser => {
  const output: ResearchOutput = {
    url: chance.url(),
    doi: chance.string(),
    outputType: chance.pickone([
      'dataset',
      'code',
      'protocol',
      'resource',
      'preprint',
      'other',
    ]),
    title: chance.sentence(),
    description: chance.paragraph(),
    authors: [
      {
        displayName: chance.name(),
      },
    ],
    publishDate: '2020-02-02T12:00:00Z',
  };

  await cms.researchOutputs.create(user, 'test', output);
};
