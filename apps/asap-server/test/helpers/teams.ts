import Chance from 'chance';

import { CMS } from '../../src/cms';
import { CMSTeam } from '../../src/entities/team';

const chance = new Chance();
const cms = new CMS();

export const createRandomTeam = (): Promise<CMSTeam> => {
  const team = {
    displayName: `${chance.first()} ${chance.last()}`,
    applicationNumber: chance.word(),
    projectTitle: chance.sentence(),
    projectSummary: chance.paragraph(),
    proposalURL: chance.url(),
    skills: [chance.word()],
  };

  return cms.teams.create(team);
};
