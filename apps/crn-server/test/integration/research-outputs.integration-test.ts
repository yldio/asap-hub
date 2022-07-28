import { Chance } from 'chance';
import { ValidationError } from '@asap-hub/errors';
import {
  ResearchOutput,
  RestExternalAuthor,
  RestResearchOutput,
  RestTeam,
  SquidexGraphql,
  SquidexRest,
} from '@asap-hub/squidex';
import { ResearchOutputResponse } from '@asap-hub/model';
import { createResearchOutput } from '../helpers/research-outputs';
import ResearchOutputs from '../../src/controllers/research-outputs';
import { getAuthToken } from '../../src/utils/auth';
import { appName, baseUrl } from '../../src/config';
import { ResearchOutputSquidexDataProvider } from '../../src/data-providers/research-outputs.data-provider';
import { ResearchTagSquidexDataProvider } from '../../src/data-providers/research-tags.data-provider';
import { ExternalAuthorSquidexDataProvider } from '../../src/data-providers/external-authors.data-provider';

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
const externalAuthorsRestClient = new SquidexRest<RestExternalAuthor>(
  getAuthToken,
  'external-authors',
  { appName, baseUrl },
);
const researchOutputDataProvider = new ResearchOutputSquidexDataProvider(
  squidexGraphqlClient,
  researchOutputRestClient,
  teamRestClient,
);
const researchTagDataProvider = new ResearchTagSquidexDataProvider(
  squidexGraphqlClient,
);
const externalAuthorDataProvider = new ExternalAuthorSquidexDataProvider(
  externalAuthorsRestClient,
);
const researchOutputs = new ResearchOutputs(
  researchOutputDataProvider,
  researchTagDataProvider,
  externalAuthorDataProvider,
);

describe('Research Outputs', () => {
  const randomTitle = chance.guid();

  const researchOutput: Partial<ResearchOutput> = {
    documentType: 'Grant Document',
    title: randomTitle,
    description: 'Research Output Description',
    sharingStatus: 'Network Only',
    asapFunded: 'Not Sure',
    usedInAPublication: 'Not Sure',
    addedDate: '2021-05-21T13:18:31Z',
  };

  test('Valid dois should succeed', async () => {
    researchOutput.doi = '10.5555/YFRU1371';

    await createResearchOutput(researchOutput);

    const result = await researchOutputs.fetch({
      take: 1,
      skip: 0,
      search: randomTitle,
    });

    const expectedResponse: Partial<ResearchOutputResponse> = {
      documentType: 'Grant Document',
      title: randomTitle,
      description: 'Research Output Description',
      sharingStatus: 'Network Only',
      asapFunded: undefined,
      usedInPublication: undefined,
    };

    expect(result).toEqual({
      total: 1,
      items: [expect.objectContaining(expectedResponse)],
    });
  });

  test('Invalid dois should fail', async () => {
    researchOutput.doi = 'invalid doi';

    await expect(createResearchOutput(researchOutput)).rejects.toThrow(
      new ValidationError(new Error(), ['doi.iv: Must follow the pattern.']),
    );
  });
});
