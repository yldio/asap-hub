import type {
  AlgoliaSearchClient,
  ClientSearchResponse,
} from '@asap-hub/algolia';
import { createWorkingGroupResponse } from '@asap-hub/fixtures';
import { GetListOptions } from '@asap-hub/frontend-utils';

import { ResearchOutputPostRequest } from '@asap-hub/model';
import nock from 'nock';
import { API_BASE_URL } from '../../../config';
import { getWorkingGroup, getWorkingGroups } from '../api';
import { createResearchOutput } from '../../teams/api';
import { createAlgoliaResponse } from '../../../__fixtures__/algolia';

describe('getWorkingGroup', () => {
  it('makes an authorized GET request for the working group id', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/working-groups/42')
      .reply(200, {});
    await getWorkingGroup('42', 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns a successfully fetched working-group', async () => {
    const group = createWorkingGroupResponse({});
    nock(API_BASE_URL).get('/working-groups/42').reply(200, group);
    expect(await getWorkingGroup('42', '')).toEqual(group);
  });

  it('returns undefined for a 404', async () => {
    nock(API_BASE_URL).get('/working-groups/42').reply(404);
    expect(await getWorkingGroup('42', '')).toBe(undefined);
  });

  it('errors for another status', async () => {
    nock(API_BASE_URL).get('/working-groups/42').reply(500);
    await expect(
      getWorkingGroup('42', ''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch working group with id 42. Expected status 2xx or 404. Received status 500."`,
    );
  });
});

describe('getWorkingGroups', () => {
  type Search = () => Promise<ClientSearchResponse<'crn', 'working-group'>>;

  const search: jest.MockedFunction<Search> = jest.fn();

  const algoliaSearchClient = {
    search,
  } as unknown as AlgoliaSearchClient<'crn'>;

  const defaultOptions: GetListOptions = {
    searchQuery: '',
    pageSize: null,
    currentPage: null,
    filters: new Set(),
  };

  beforeEach(() => {
    search.mockReset();

    const workingGroupResponse = createWorkingGroupResponse();

    search.mockResolvedValue(
      createAlgoliaResponse<'crn', 'working-group'>([
        {
          ...workingGroupResponse,
          objectID: workingGroupResponse.id,
          __meta: { type: 'working-group' },
        },
      ]),
    );
  });

  it('should not filter working groups by default', async () => {
    await getWorkingGroups(algoliaSearchClient, {
      ...defaultOptions,
    });
    expect(search).toHaveBeenCalledWith(
      ['working-group'],
      '',
      expect.objectContaining({
        filters: undefined,
      }),
    );
  });

  it('should not default to any specific page or limit hits per page', async () => {
    await getWorkingGroups(algoliaSearchClient, {
      ...defaultOptions,
    });
    expect(search).toHaveBeenCalledWith(
      ['working-group'],
      '',
      expect.objectContaining({
        hitsPerPage: undefined,
        page: undefined,
      }),
    );
  });

  it('should pass the search query to Algolia', async () => {
    await getWorkingGroups(algoliaSearchClient, {
      ...defaultOptions,
      searchQuery: 'Data Analysis',
    });
    expect(search).toHaveBeenCalledWith(
      ['working-group'],
      'Data Analysis',
      expect.objectContaining({}),
    );
  });

  it.each([
    { filter: 'Complete', algoliaFilter: 'complete:true' },
    { filter: 'Active', algoliaFilter: 'complete:false' },
  ])(
    'should filter the working groups by status when its value is $filter',
    async ({ filter, algoliaFilter }) => {
      await getWorkingGroups(algoliaSearchClient, {
        ...defaultOptions,
        filters: new Set([filter]),
      });
      expect(search).toHaveBeenCalledWith(['working-group'], '', {
        filters: algoliaFilter,
      });
    },
  );

  it('should return successfully fetched working groups', async () => {
    const workingGroups = await getWorkingGroups(
      algoliaSearchClient,
      defaultOptions,
    );
    expect(workingGroups).toEqual(
      expect.objectContaining({
        items: [
          {
            ...createWorkingGroupResponse(),
            __meta: { type: 'working-group' },
            objectID: 'working-group-id-0',
          },
        ],
        total: 1,
      }),
    );
  });
});

describe('working group research output', () => {
  const payload: ResearchOutputPostRequest = {
    teams: ['90210'],
    documentType: 'Article',
    link: 'http://a-link',
    title: 'A title',
    asapFunded: false,
    usedInPublication: false,
    sharingStatus: 'Public',
    publishDate: undefined,
    description: '',
    descriptionMD: '',
    type: 'Preprint',
    labs: ['lab1'],
    methods: [],
    organisms: [],
    environments: [],
    relatedResearch: [],
    relatedEvents: [],
    keywords: [],
    authors: [{ userId: 'user-1' }],
    workingGroups: ['wg-1'],
    published: true,
  };
  it('makes an authorized POST request to create a research output', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .post('/research-outputs', payload)
      .reply(201, { id: 123 });

    await createResearchOutput(payload, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('errors for an error status', async () => {
    nock(API_BASE_URL).post('/research-outputs').reply(500, {});

    await expect(
      createResearchOutput(payload, 'Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to create research output for Working Group. Expected status 201. Received status 500."`,
    );
  });
});
