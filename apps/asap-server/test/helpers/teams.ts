import Chance from 'chance';

import { Squidex } from '@asap-hub/services-common';
import { CMSTeam } from '../../src/entities/team';

const chance = new Chance();
const teams: Squidex<CMSTeam> = new Squidex('teams');

export const createRandomTeam = (): Promise<CMSTeam> => {
  const team = {
    displayName: { iv: `${chance.first()} ${chance.last()}` },
    applicationNumber: { iv: chance.word() },
    projectTitle: { iv: chance.sentence() },
    projectSummary: { iv: chance.paragraph() },
    proposalURL: { iv: chance.url() },
    skills: { iv: [] },
  };

  return teams.create(team);
};
