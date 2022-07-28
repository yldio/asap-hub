import { Chance } from 'chance';
import {
  RestResearchOutput,
  RestTeam,
  SquidexGraphql,
  SquidexRest,
} from '@asap-hub/squidex';
import { getAuthToken } from '../../src/utils/auth';
import { appName, baseUrl } from '../../src/config';
import { ResearchOutputSquidexDataProvider } from '../../src/data-providers/research-outputs.data-provider';
import { getResearchOutputCreateDataObject, getResearchOutputDataObject } from '../fixtures/research-output.fixtures';

const chance = new Chance();
const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
  appName,
  baseUrl,
});
const researchOutputRestClient = new SquidexRest<RestResearchOutput>(
  getAuthToken,
  'research-outputs',
  { appName, baseUrl },
);
const teamRestClient = new SquidexRest<RestTeam>(getAuthToken, 'teams', {
  appName,
  baseUrl,
});
const researchOutputDataProvider = new ResearchOutputSquidexDataProvider(
  squidexGraphqlClient,
  researchOutputRestClient,
  teamRestClient,
);

describe('Research Outputs', () => {
  test('Should create and fetch the research output by ID', async () => {
    const researchOutputInput = getResearchOutputCreateDataObject();
    const randomTitle = chance.guid();
    researchOutputInput.title = randomTitle;

    const researchOutputId = await researchOutputDataProvider.create(researchOutputInput);

    const result = await researchOutputDataProvider.fetchById(researchOutputId)

    const expectedResult = getResearchOutputDataObject();
    expectedResult.title = randomTitle;
    expect(result).toEqual(expectedResult);
  });
});
