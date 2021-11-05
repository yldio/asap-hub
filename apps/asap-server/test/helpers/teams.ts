import Chance from 'chance';

import { Squidex, RestTeam } from '@asap-hub/squidex';

const chance = new Chance();
const teams: Squidex<RestTeam> = new Squidex('teams');

export const createRandomTeam = (): Promise<RestTeam> => {
  const team = {
    displayName: { iv: `${chance.first()} ${chance.last()}` },
    applicationNumber: { iv: chance.word() },
    projectTitle: { iv: chance.sentence() },
    projectSummary: { iv: chance.paragraph() },
    expertiseAndResourceTags: { iv: [] },
    outputs: { iv: [] },
  };

  return teams.create(team);
};
