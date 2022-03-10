import Chance from 'chance';

import { RestTeam, SquidexRest, SquidexRestClient } from '@asap-hub/squidex';

const chance = new Chance();
const teams: SquidexRestClient<RestTeam> = new SquidexRest('teams');

export const createRandomTeam = (): Promise<RestTeam> => {
  const team = {
    displayName: { iv: `${chance.first()} ${chance.last()}` },
    applicationNumber: { iv: chance.word() },
    projectTitle: { iv: chance.sentence() },
    projectSummary: { iv: chance.paragraph() },
    expertiseAndResourceTags: { iv: [] },
  };

  return teams.create(team);
};
