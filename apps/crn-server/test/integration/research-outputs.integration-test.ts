import { Chance } from 'chance';
import {
  InputUser,
  RestResearchOutput,
  RestUser,
  SquidexGraphql,
  SquidexRest,
} from '@asap-hub/squidex';
import { getAuthToken } from '../../src/utils/auth';
import { appName, baseUrl } from '../../src/config';
import { ResearchOutputSquidexDataProvider } from '../../src/data-providers/research-outputs.data-provider';
import {
  getResearchOutputCreateDataObject,
  getResearchOutputDataObject,
} from '../fixtures/research-output.fixtures';
import { getUserCreateDataObject } from '../fixtures/users.fixtures';
import { UserSquidexDataProvider } from '../../src/data-providers/users.data-provider';
import { teardownHelper } from '../helpers/teardown';
import { retryable } from '../helpers/retryable';

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
const userRestClient = new SquidexRest<RestUser, InputUser>(
  getAuthToken,
  'users',
  {
    appName,
    baseUrl,
  },
);
const userDataProvider = new UserSquidexDataProvider(
  squidexGraphqlClient,
  userRestClient,
);
const researchOutputDataProvider = new ResearchOutputSquidexDataProvider(
  squidexGraphqlClient,
  researchOutputRestClient,
);

describe('Research Outputs', () => {
  let userId: string;

  const teardown = teardownHelper([userRestClient, researchOutputRestClient]);

  afterEach(async () => {
    await teardown();
  });

  beforeEach(async () => {
    const userCreateDataObject = getUserCreateDataObject();
    userCreateDataObject.teams = [];
    userCreateDataObject.labIds = [];
    userCreateDataObject.email = chance.email();
    delete userCreateDataObject.orcid;
    delete userCreateDataObject.avatar;
    userId = await userDataProvider.create(userCreateDataObject);
  });

  test('Should create and fetch the research output by ID', async () => {
    const researchOutputInput = getResearchOutputCreateDataObject();
    researchOutputInput.subtypeId = undefined;
    researchOutputInput.link = chance.url();
    researchOutputInput.environmentIds = [];
    researchOutputInput.organismIds = [];
    researchOutputInput.methodIds = [];
    researchOutputInput.teamIds = [];
    researchOutputInput.relatedResearchIds = [];
    researchOutputInput.labIds = [];
    researchOutputInput.authors = [{ userId }];
    researchOutputInput.createdBy = userId;

    const randomTitle = chance.guid();
    researchOutputInput.title = randomTitle;

    const researchOutputId = await researchOutputDataProvider.create(
      researchOutputInput,
    );

    await retryable(async () => {
      const result = await researchOutputDataProvider.fetchById(
        researchOutputId,
      );

      const expectedResult = getResearchOutputDataObject();
      expectedResult.title = randomTitle;
      expect(result).toEqual(
        expect.objectContaining({
          id: researchOutputId,
          title: randomTitle,
          link: researchOutputInput.link,
        }),
      );
    });
  });
});
