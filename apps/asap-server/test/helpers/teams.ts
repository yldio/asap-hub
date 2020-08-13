import Chance from 'chance';

import { CMS } from '../../src/cms';
import { CMSTeam } from '../../src/entities/team';

const chance = new Chance();
const cms = new CMS();

export const createRandomTeam = (): Promise<CMSTeam> => {
  const team = {
    displayName: chance.string(),
    applicationNumber: chance.string(),
    projectTitle: chance.sentence(),
    projectSummary: chance.paragraph(),
    proposalURL: chance.url(),
    skills: [chance.string()],
  };

  return cms.teams.create(team);
};
