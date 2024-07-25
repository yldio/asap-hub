import { AlgoliaSearchClient } from '@asap-hub/algolia';
import {
  createListResearchOutputResponse,
  createResearchOutputResponse,
  createResearchTagListResponse,
} from '@asap-hub/fixtures';
import { GetListOptions } from '@asap-hub/frontend-utils';
import {
  researchOutputDocumentTypes,
  ResearchOutputFilterOptionTypes,
  ResearchOutputPublishingEntitiesValues,
} from '@asap-hub/model';
import nock from 'nock';
import { API_BASE_URL } from '../../config';
import { CARD_VIEW_PAGE_SIZE } from '../../hooks';
import { createResearchOutputListAlgoliaResponse } from '../../__fixtures__/algolia';
import {
  getDraftResearchOutputs,
  getGeneratedOutputContent,
  getResearchOutput,
  getResearchOutputs,
  getResearchTags,
} from '../api';

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
  } as unknown as jest.Mocked<AlgoliaSearchClient<'crn'>>;

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
  it.each(researchOutputDocumentTypes)(
    'builds a single %s document type filter query',
    async (documentType) => {
      await getResearchOutputs(mockAlgoliaSearchClient, {
        ...options,
        filters: new Set<ResearchOutputFilterOptionTypes>([documentType]),
      });

      expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
        ['research-output'],
        '',
        expect.objectContaining({
          filters: `(documentType:"${documentType}")`,
        }),
      );
    },
  );

  it.each(ResearchOutputPublishingEntitiesValues)(
    'builds a single %s publishingEntity filter query',
    async (publishingEntity) => {
      await getResearchOutputs(mockAlgoliaSearchClient, {
        ...options,
        filters: new Set<ResearchOutputFilterOptionTypes>([publishingEntity]),
      });

      expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
        ['research-output'],
        '',
        expect.objectContaining({
          filters: `(publishingEntity:"${publishingEntity}")`,
        }),
      );
    },
  );

  it('builds a multiple filter query', async () => {
    await getResearchOutputs(mockAlgoliaSearchClient, {
      ...options,
      filters: new Set<ResearchOutputFilterOptionTypes>([
        'Article',
        'Grant Document',
        'Team',
      ]),
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['research-output'],
      '',
      expect.objectContaining({
        filters:
          '(publishingEntity:"Team") AND (documentType:"Article" OR documentType:"Grant Document")',
      }),
    );
  });

  it('ignores unknown filters', async () => {
    await getResearchOutputs(mockAlgoliaSearchClient, {
      ...options,
      filters: new Set<ResearchOutputFilterOptionTypes | 'invalid'>([
        'Article',
        'Working Group',
        'invalid',
      ]),
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['research-output'],
      '',
      expect.objectContaining({
        filters:
          '(publishingEntity:"Working Group") AND (documentType:"Article")',
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

  it('adds workingGroupId to documentType filter', async () => {
    await getResearchOutputs(mockAlgoliaSearchClient, {
      ...options,
      filters: new Set<ResearchOutputFilterOptionTypes>(['Report']),
      workingGroupId: 'wg',
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['research-output'],
      '',
      expect.objectContaining({
        filters: '(documentType:"Report") AND workingGroups.id:"wg"',
      }),
    );
  });

  it('adds teamId to documentType filter', async () => {
    await getResearchOutputs(mockAlgoliaSearchClient, {
      ...options,
      filters: new Set<ResearchOutputFilterOptionTypes>(['Article']),
      teamId: '12345',
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['research-output'],
      '',
      expect.objectContaining({
        filters: '(documentType:"Article") AND teams.id:"12345"',
      }),
    );
  });

  it('adds teamId to documentType filters', async () => {
    await getResearchOutputs(mockAlgoliaSearchClient, {
      ...options,
      filters: new Set<ResearchOutputFilterOptionTypes>([
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
          '(documentType:"Article" OR documentType:"Grant Document") AND teams.id:"12345"',
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

  it('adds userId to filter', async () => {
    await getResearchOutputs(mockAlgoliaSearchClient, {
      ...options,
      filters: new Set<ResearchOutputFilterOptionTypes>(['Article', 'Team']),
      userId: '12345',
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['research-output'],
      '',
      expect.objectContaining({
        filters:
          '(publishingEntity:"Team") AND (documentType:"Article") AND authors.id:"12345"',
      }),
    );
  });

  it('adds userId to documentType filters', async () => {
    await getResearchOutputs(mockAlgoliaSearchClient, {
      ...options,
      filters: new Set<ResearchOutputFilterOptionTypes>([
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
          '(documentType:"Article" OR documentType:"Grant Document") AND authors.id:"12345"',
      }),
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

describe('getResearchTags', () => {
  it('makes an authorized GET request for the research tags', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/research-tags')
      .query({
        take: 200,
      })
      .reply(200, {});
    await getResearchTags('Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns a successfully fetched research tags', async () => {
    const researchTags = createResearchTagListResponse();
    nock(API_BASE_URL)
      .get('/research-tags')
      .query(true)
      .reply(200, researchTags);
    expect(await getResearchTags('')).toEqual(researchTags.items);
  });

  it('errors for invalid status', async () => {
    nock(API_BASE_URL).get('/research-tags').query(true).reply(500);
    await expect(
      getResearchTags(''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch research tags. Expected status 2xx. Received status 500."`,
    );
  });
});

describe('getDraftResearchOutputs', () => {
  it('makes an authorized GET request for draft research outputs', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/research-outputs')
      .query(true)
      .reply(200, {});
    await getDraftResearchOutputs(
      {
        pageSize: 10,
        searchQuery: '',
        userAssociationMember: true,
        teamId: '123',
        currentPage: 0,
        draftsOnly: true,
        filters: new Set(),
      },
      'Bearer x',
    );
    expect(nock.isDone()).toBe(true);
  });

  it('does a draft team research outputs query and returns results for user association members', async () => {
    nock(API_BASE_URL)
      .get('/research-outputs')
      .query({
        status: 'draft',
        teamId: '123',
        take: 10,
        skip: 0,
      })
      .reply(200, createListResearchOutputResponse(1));
    expect(
      await getDraftResearchOutputs(
        {
          pageSize: 10,
          searchQuery: '',
          userAssociationMember: true,
          teamId: '123',
          currentPage: 0,
          draftsOnly: true,
          filters: new Set(),
        },
        '',
      ),
    ).toEqual(createListResearchOutputResponse(1));
    expect(nock.isDone()).toBe(true);
  });

  it('does a draft working group research outputs query and returns results for user association members', async () => {
    nock(API_BASE_URL)
      .get('/research-outputs')
      .query({
        status: 'draft',
        workingGroupId: '123',
        take: 10,
        skip: 0,
      })
      .reply(200, createListResearchOutputResponse(1));
    expect(
      await getDraftResearchOutputs(
        {
          pageSize: 10,
          searchQuery: '',
          userAssociationMember: true,
          workingGroupId: '123',
          currentPage: 0,
          draftsOnly: true,
          filters: new Set(),
        },
        '',
      ),
    ).toEqual(createListResearchOutputResponse(1));
    expect(nock.isDone()).toBe(true);
  });

  it('returns an empty result when not an association member', async () => {
    expect(
      await getDraftResearchOutputs(
        {
          pageSize: 10,
          searchQuery: '',
          userAssociationMember: false,
          teamId: '123',
          currentPage: 0,
          draftsOnly: true,
          filters: new Set(),
        },
        '',
      ),
    ).toEqual({
      items: [],
      total: 0,
    });
  });

  it('errors for another status', async () => {
    nock(API_BASE_URL).get('/research-outputs').query(true).reply(500);
    await expect(
      getDraftResearchOutputs(
        {
          pageSize: 10,
          searchQuery: '',
          userAssociationMember: true,
          teamId: '123',
          currentPage: 0,
          draftsOnly: true,
          filters: new Set(),
        },
        '',
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch draft research outputs. Expected status 2xx. Received status 500."`,
    );
  });
});

describe('getGeneratedOutputContent', () => {
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });

  it('returns a successfully fetched short description', async () => {
    const { descriptionMD, shortDescription } = createResearchOutputResponse();

    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .post(`/research-outputs/generate-content`, {
        descriptionMD,
      })
      .reply(200, { shortDescription });

    const result = await getGeneratedOutputContent(
      { descriptionMD },
      'Bearer x',
    );
    expect(result).toEqual({ shortDescription });
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .post(`/research-outputs/generate-content`, {
        descriptionMD: 'test',
      })
      .reply(500, {});

    await expect(
      getGeneratedOutputContent({ descriptionMD: 'test' }, 'Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to generate content for research output. Expected status 200. Received status 500."`,
    );
  });
});
