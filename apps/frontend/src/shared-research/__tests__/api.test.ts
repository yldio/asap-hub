import nock from 'nock';

import {
  createListResearchOutputResponse,
  createResearchOutputResponse,
  createAlgoliaResearchOutputResponse,
} from '@asap-hub/fixtures';
import { SearchIndex } from 'algoliasearch/lite';
import { ResearchOutputType } from '@asap-hub/model';

import {
  getResearchOutput,
  getResearchOutputs,
  getResearchOutputsLegacy,
} from '../api';
import { API_BASE_URL } from '../../config';
import { GetListOptions } from '../../api-util';
import { CARD_VIEW_PAGE_SIZE } from '../../hooks';

jest.mock('../../config');

afterEach(() => {
  nock.cleanAll();
});

const options: GetListOptions = {
  filters: new Set<string>(),
  pageSize: CARD_VIEW_PAGE_SIZE,
  currentPage: 0,
  searchQuery: '',
};

describe('getResearchOutputs', () => {
  // This mock is pretty basic. @todo: Refactor into something reusable and think about
  // how to make more generic query building that can be tested in isolation
  const mockedSearch: jest.MockedFunction<SearchIndex['search']> = jest
    .fn()
    .mockResolvedValue(createAlgoliaResearchOutputResponse(10));

  const mockIndex = {
    search: mockedSearch,
  } as jest.Mocked<SearchIndex>;

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('makes a search request with query, default page and page size', async () => {
    await getResearchOutputs(mockIndex, {
      ...options,
      searchQuery: 'test',
      currentPage: null,
      pageSize: null,
    });

    expect(mockIndex.search).toHaveBeenLastCalledWith(
      'test',
      expect.objectContaining({ hitsPerPage: 10, page: 0 }),
    );
  });
  it('passes page number and page size to request', async () => {
    await getResearchOutputs(mockIndex, {
      ...options,
      currentPage: 1,
      pageSize: 20,
    });

    expect(mockIndex.search).toHaveBeenLastCalledWith(
      '',
      expect.objectContaining({ hitsPerPage: 20, page: 1 }),
    );
  });
  it('builds a single filter query', async () => {
    await getResearchOutputs(mockIndex, {
      ...options,
      filters: new Set<ResearchOutputType>(['Article']),
    });

    expect(mockIndex.search).toHaveBeenLastCalledWith(
      '',
      expect.objectContaining({ filters: '(type:Article)' }),
    );
  });

  it('builds a multiple filter query', async () => {
    await getResearchOutputs(mockIndex, {
      ...options,
      filters: new Set<ResearchOutputType>(['Article', 'Proposal']),
    });

    expect(mockIndex.search).toHaveBeenLastCalledWith(
      '',
      expect.objectContaining({ filters: '(type:Article OR type:Proposal)' }),
    );
  });

  it('ignores unknown filters', async () => {
    await getResearchOutputs(mockIndex, {
      ...options,
      filters: new Set<ResearchOutputType | 'invalid'>(['Article', 'invalid']),
    });

    expect(mockIndex.search).toHaveBeenLastCalledWith(
      '',
      expect.objectContaining({ filters: '(type:Article)' }),
    );
  });

  it('uses teamId as a filter', async () => {
    await getResearchOutputs(mockIndex, {
      ...options,
      teamId: '12345',
    });

    expect(mockIndex.search).toHaveBeenLastCalledWith(
      '',
      expect.objectContaining({ filters: 'teams.id:"12345"' }),
    );
  });

  it('adds teamId to type filter', async () => {
    await getResearchOutputs(mockIndex, {
      ...options,
      filters: new Set<ResearchOutputType>(['Article']),
      teamId: '12345',
    });

    expect(mockIndex.search).toHaveBeenLastCalledWith(
      '',
      expect.objectContaining({
        filters: '(type:Article) AND teams.id:"12345"',
      }),
    );
  });

  it('adds teamId to type filters', async () => {
    await getResearchOutputs(mockIndex, {
      ...options,
      filters: new Set<ResearchOutputType>(['Article', 'Proposal']),
      teamId: '12345',
    });

    expect(mockIndex.search).toHaveBeenLastCalledWith(
      '',
      expect.objectContaining({
        filters: '(type:Article OR type:Proposal) AND teams.id:"12345"',
      }),
    );
  });
  it('uses userId as a filter', async () => {
    await getResearchOutputs(mockIndex, {
      ...options,
      userId: '12345',
    });

    expect(mockIndex.search).toHaveBeenLastCalledWith(
      '',
      expect.objectContaining({ filters: 'authors.id:"12345"' }),
    );
  });

  it('adds userId to type filter', async () => {
    await getResearchOutputs(mockIndex, {
      ...options,
      filters: new Set<ResearchOutputType>(['Article']),
      userId: '12345',
    });

    expect(mockIndex.search).toHaveBeenLastCalledWith(
      '',
      expect.objectContaining({
        filters: '(type:Article) AND authors.id:"12345"',
      }),
    );
  });

  it('adds userId to type filters', async () => {
    await getResearchOutputs(mockIndex, {
      ...options,
      filters: new Set<ResearchOutputType>(['Article', 'Proposal']),
      userId: '12345',
    });

    expect(mockIndex.search).toHaveBeenLastCalledWith(
      '',
      expect.objectContaining({
        filters: '(type:Article OR type:Proposal) AND authors.id:"12345"',
      }),
    );
  });

  it('throws an error of type error', async () => {
    mockedSearch.mockRejectedValue({ message: 'Some Error' });
    await expect(
      getResearchOutputs(mockIndex, options),
    ).rejects.toMatchInlineSnapshot(`[Error: Could not search: Some Error]`);
  });
});

describe('getResearchOutputsLegacy', () => {
  it('makes an authorized GET request for research outputs', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/research-outputs')
      .query({ take: '10', skip: '0' })
      .reply(200, {});
    await getResearchOutputsLegacy(options, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns successfully fetched research outputs', async () => {
    const users = createListResearchOutputResponse(1);
    nock(API_BASE_URL)
      .get('/research-outputs')
      .query({ take: '10', skip: '0' })
      .reply(200, users);
    expect(await getResearchOutputsLegacy(options, '')).toEqual(users);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL)
      .get('/research-outputs')
      .query({ take: '10', skip: '0' })
      .reply(500);
    await expect(
      getResearchOutputsLegacy(options, ''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch research output list. Expected status 2xx. Received status 500."`,
    );
  });
});

describe('getResearchOutput', () => {
  it('makes an authorized GET request for the research output id', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/research-outputs/42')
      .reply(200, {});
    await getResearchOutput('42', 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns a successfully fetched research output', async () => {
    const researchOutput = createResearchOutputResponse();
    nock(API_BASE_URL).get('/research-outputs/42').reply(200, researchOutput);
    expect(await getResearchOutput('42', '')).toEqual(researchOutput);
  });

  it('returns undefined for a 404', async () => {
    nock(API_BASE_URL).get('/research-outputs/42').reply(404);
    expect(await getResearchOutput('42', '')).toBe(undefined);
  });

  it('errors for another status', async () => {
    nock(API_BASE_URL).get('/research-outputs/42').reply(500);
    await expect(
      getResearchOutput('42', ''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch research output with id 42. Expected status 2xx or 404. Received status 500."`,
    );
  });
});
