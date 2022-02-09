import nock from 'nock';

import { ResearchOutputSearchIndex, SearchIndex } from '@asap-hub/algolia';
import { ResearchOutputType } from '@asap-hub/model';

import {
  createResearchOutputAlgoliaResponse,
  createResearchOutputListAlgoliaResponse,
} from '../../__fixtures__/algolia';
import { getResearchOutput, getResearchOutputs } from '../api';
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
    .mockResolvedValue(createResearchOutputListAlgoliaResponse(10));

  const mockAlgoliaIndex: SearchIndex = {
    search: mockedSearch,
  } as jest.Mocked<SearchIndex>;

  const mockResearchOutputIndex = new ResearchOutputSearchIndex(
    mockAlgoliaIndex,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('makes a search request with query, default page and page size', async () => {
    await getResearchOutputs(mockResearchOutputIndex, {
      ...options,
      searchQuery: 'test',
      currentPage: null,
      pageSize: null,
    });

    expect(mockAlgoliaIndex.search).toHaveBeenLastCalledWith(
      'test',
      expect.objectContaining({ hitsPerPage: 10, page: 0 }),
    );
  });
  it('passes page number and page size to request', async () => {
    await getResearchOutputs(mockResearchOutputIndex, {
      ...options,
      currentPage: 1,
      pageSize: 20,
    });

    expect(mockAlgoliaIndex.search).toHaveBeenLastCalledWith(
      '',
      expect.objectContaining({ hitsPerPage: 20, page: 1 }),
    );
  });
  it('builds a single filter query', async () => {
    await getResearchOutputs(mockResearchOutputIndex, {
      ...options,
      filters: new Set<ResearchOutputType>(['Article']),
    });

    expect(mockAlgoliaIndex.search).toHaveBeenLastCalledWith(
      '',
      expect.objectContaining({
        filters: '(type:Article) AND __meta.type:"research-output"',
      }),
    );
  });

  it('builds a multiple filter query', async () => {
    await getResearchOutputs(mockResearchOutputIndex, {
      ...options,
      filters: new Set<ResearchOutputType>(['Article', 'Grant Document']),
    });

    expect(mockAlgoliaIndex.search).toHaveBeenLastCalledWith(
      '',
      expect.objectContaining({
        filters:
          '(type:Article OR type:"Grant Document") AND __meta.type:"research-output"',
      }),
    );
  });

  it('ignores unknown filters', async () => {
    await getResearchOutputs(mockResearchOutputIndex, {
      ...options,
      filters: new Set<ResearchOutputType | 'invalid'>(['Article', 'invalid']),
    });

    expect(mockAlgoliaIndex.search).toHaveBeenLastCalledWith(
      '',
      expect.objectContaining({
        filters: '(type:Article) AND __meta.type:"research-output"',
      }),
    );
  });

  it('uses teamId as a filter', async () => {
    await getResearchOutputs(mockResearchOutputIndex, {
      ...options,
      teamId: '12345',
    });

    expect(mockAlgoliaIndex.search).toHaveBeenLastCalledWith(
      '',
      expect.objectContaining({
        filters: 'teams.id:"12345" AND __meta.type:"research-output"',
      }),
    );
  });

  it('adds teamId to type filter', async () => {
    await getResearchOutputs(mockResearchOutputIndex, {
      ...options,
      filters: new Set<ResearchOutputType>(['Article']),
      teamId: '12345',
    });

    expect(mockAlgoliaIndex.search).toHaveBeenLastCalledWith(
      '',
      expect.objectContaining({
        filters:
          '(type:Article) AND teams.id:"12345" AND __meta.type:"research-output"',
      }),
    );
  });

  it('adds teamId to type filters', async () => {
    await getResearchOutputs(mockResearchOutputIndex, {
      ...options,
      filters: new Set<ResearchOutputType>(['Article', 'Grant Document']),
      teamId: '12345',
    });

    expect(mockAlgoliaIndex.search).toHaveBeenLastCalledWith(
      '',
      expect.objectContaining({
        filters:
          '(type:Article OR type:"Grant Document") AND teams.id:"12345" AND __meta.type:"research-output"',
      }),
    );
  });
  it('uses userId as a filter', async () => {
    await getResearchOutputs(mockResearchOutputIndex, {
      ...options,
      userId: '12345',
    });

    expect(mockAlgoliaIndex.search).toHaveBeenLastCalledWith(
      '',
      expect.objectContaining({
        filters: 'authors.id:"12345" AND __meta.type:"research-output"',
      }),
    );
  });

  it('adds userId to type filter', async () => {
    await getResearchOutputs(mockResearchOutputIndex, {
      ...options,
      filters: new Set<ResearchOutputType>(['Article']),
      userId: '12345',
    });

    expect(mockAlgoliaIndex.search).toHaveBeenLastCalledWith(
      '',
      expect.objectContaining({
        filters:
          '(type:Article) AND authors.id:"12345" AND __meta.type:"research-output"',
      }),
    );
  });

  it('adds userId to type filters', async () => {
    await getResearchOutputs(mockResearchOutputIndex, {
      ...options,
      filters: new Set<ResearchOutputType>(['Article', 'Grant Document']),
      userId: '12345',
    });

    expect(mockAlgoliaIndex.search).toHaveBeenLastCalledWith(
      '',
      expect.objectContaining({
        filters:
          '(type:Article OR type:"Grant Document") AND authors.id:"12345" AND __meta.type:"research-output"',
      }),
    );
  });

  it('throws an error of type error', async () => {
    mockedSearch.mockRejectedValue({ message: 'Some Error' });
    await expect(
      getResearchOutputs(mockResearchOutputIndex, options),
    ).rejects.toMatchInlineSnapshot(`[Error: Could not search: Some Error]`);
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
    const researchOutput = createResearchOutputAlgoliaResponse();
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
