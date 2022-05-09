import nock from 'nock';

import { AlgoliaSearchClient } from '@asap-hub/algolia';
import { ResearchOutputDocumentType } from '@asap-hub/model';
import { createResearchOutputResponse } from '@asap-hub/fixtures';

import { createResearchOutputListAlgoliaResponse } from '../../__fixtures__/algolia';
import { getResearchOutput, getResearchOutputs } from '../api';
import { API_BASE_URL } from '../../config';
import { GetListOptions } from '@asap-hub/frontend-utils';
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
  const mockAlgoliaSearchClient = {
    search: jest
      .fn()
      .mockResolvedValue(createResearchOutputListAlgoliaResponse(10)),
  } as unknown as jest.Mocked<AlgoliaSearchClient>;

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('makes a search request with query, default page and page size', async () => {
    await getResearchOutputs(mockAlgoliaSearchClient, {
      ...options,
      searchQuery: 'test',
      currentPage: null,
      pageSize: null,
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['research-output'],
      'test',
      expect.objectContaining({ hitsPerPage: 10, page: 0 }),
    );
  });
  it('passes page number and page size to request', async () => {
    await getResearchOutputs(mockAlgoliaSearchClient, {
      ...options,
      currentPage: 1,
      pageSize: 20,
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['research-output'],
      '',
      expect.objectContaining({ hitsPerPage: 20, page: 1 }),
    );
  });
  it('builds a single filter query', async () => {
    await getResearchOutputs(mockAlgoliaSearchClient, {
      ...options,
      filters: new Set<ResearchOutputDocumentType>(['Article']),
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['research-output'],
      '',
      expect.objectContaining({
        filters: '(documentType:Article)',
      }),
    );
  });

  it('builds a multiple filter query', async () => {
    await getResearchOutputs(mockAlgoliaSearchClient, {
      ...options,
      filters: new Set<ResearchOutputDocumentType>([
        'Article',
        'Grant Document',
      ]),
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['research-output'],
      '',
      expect.objectContaining({
        filters: '(documentType:Article OR documentType:"Grant Document")',
      }),
    );
  });

  it('ignores unknown filters', async () => {
    await getResearchOutputs(mockAlgoliaSearchClient, {
      ...options,
      filters: new Set<ResearchOutputDocumentType | 'invalid'>([
        'Article',
        'invalid',
      ]),
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['research-output'],
      '',
      expect.objectContaining({
        filters: '(documentType:Article)',
      }),
    );
  });

  it('uses teamId as a filter', async () => {
    await getResearchOutputs(mockAlgoliaSearchClient, {
      ...options,
      teamId: '12345',
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['research-output'],
      '',
      expect.objectContaining({
        filters: 'teams.id:"12345"',
      }),
    );
  });

  it('adds teamId to documentType filter', async () => {
    await getResearchOutputs(mockAlgoliaSearchClient, {
      ...options,
      filters: new Set<ResearchOutputDocumentType>(['Article']),
      teamId: '12345',
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['research-output'],
      '',
      expect.objectContaining({
        filters: '(documentType:Article) AND teams.id:"12345"',
      }),
    );
  });

  it('adds teamId to documentType filters', async () => {
    await getResearchOutputs(mockAlgoliaSearchClient, {
      ...options,
      filters: new Set<ResearchOutputDocumentType>([
        'Article',
        'Grant Document',
      ]),
      teamId: '12345',
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['research-output'],
      '',
      expect.objectContaining({
        filters:
          '(documentType:Article OR documentType:"Grant Document") AND teams.id:"12345"',
      }),
    );
  });
  it('uses userId as a filter', async () => {
    await getResearchOutputs(mockAlgoliaSearchClient, {
      ...options,
      userId: '12345',
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['research-output'],
      '',
      expect.objectContaining({
        filters: 'authors.id:"12345"',
      }),
    );
  });

  it('adds userId to documentType filter', async () => {
    await getResearchOutputs(mockAlgoliaSearchClient, {
      ...options,
      filters: new Set<ResearchOutputDocumentType>(['Article']),
      userId: '12345',
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['research-output'],
      '',
      expect.objectContaining({
        filters: '(documentType:Article) AND authors.id:"12345"',
      }),
    );
  });

  it('adds userId to documentType filters', async () => {
    await getResearchOutputs(mockAlgoliaSearchClient, {
      ...options,
      filters: new Set<ResearchOutputDocumentType>([
        'Article',
        'Grant Document',
      ]),
      userId: '12345',
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['research-output'],
      '',
      expect.objectContaining({
        filters:
          '(documentType:Article OR documentType:"Grant Document") AND authors.id:"12345"',
      }),
    );
  });

  it('throws an error of type error', async () => {
    mockAlgoliaSearchClient.search.mockRejectedValue({
      message: 'Some Error',
    });
    await expect(
      getResearchOutputs(mockAlgoliaSearchClient, options),
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
