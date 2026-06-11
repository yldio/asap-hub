/* eslint-disable no-use-before-define */
import {
  createEventResponse,
  createResearchOutputResponse,
  createUserResponse,
} from '@asap-hub/fixtures';
import {
  ExternalAuthorResponse,
  LabResponse,
  ResearchOutputResponse,
  UserResponse,
} from '@asap-hub/model';
import { AlgoliaSearchClient, ClientSearchResponse } from '../src/client';
import { getAlgoliaSearchIndexMock } from './mocks/algolia.mocks';

const INDEX_NAME = 'test-index';
const REVERSE_INDEX_NAME = 'test-index-reverse-timestamp';

describe('Algolia Search Client', () => {
  beforeEach(jest.resetAllMocks);
  const algoliaSearchIndex = getAlgoliaSearchIndexMock();
  const algoliaSearchClient = new AlgoliaSearchClient<'crn'>(
    algoliaSearchIndex as never,
    INDEX_NAME,
    REVERSE_INDEX_NAME,
  );

  test('Should do save many on entities', async () => {
    algoliaSearchIndex.saveObjects.mockResolvedValueOnce({} as never);

    await algoliaSearchClient.saveMany([
      {
        data: {
          id: `ro-id-1`,
          title: 'ro-title',
        } as ResearchOutputResponse,
        type: 'research-output',
      },
      {
        data: {
          id: `user-id-1`,
          displayName: 'user-display-name',
        } as UserResponse,
        type: 'user',
      },
      {
        data: {
          id: `external-author-id-1`,
          displayName: 'external-author-display-name',
        } as ExternalAuthorResponse,
        type: 'external-author',
      },
      {
        data: {
          id: `lab-id-1`,
          name: 'lab-title',
        } as LabResponse,
        type: 'lab',
      },
    ]);

    expect(algoliaSearchIndex.saveObjects).toBeCalledWith({
      indexName: INDEX_NAME,
      objects: [
        {
          objectID: `ro-id-1`,
          id: `ro-id-1`,
          title: 'ro-title',
          __meta: { type: 'research-output' },
        },
        {
          objectID: `user-id-1`,
          id: `user-id-1`,
          displayName: 'user-display-name',
          __meta: { type: 'user' },
        },
        {
          objectID: `external-author-id-1`,
          id: `external-author-id-1`,
          displayName: 'external-author-display-name',
          __meta: { type: 'external-author' },
        },
        {
          objectID: `lab-id-1`,
          id: `lab-id-1`,
          name: 'lab-title',
          __meta: { type: 'lab' },
        },
      ],
    });
  });

  test('Should save the Research Output', async () => {
    const researchOutput = createResearchOutputResponse();
    algoliaSearchIndex.saveObject.mockResolvedValueOnce({} as never);

    await algoliaSearchClient.save({
      data: researchOutput,
      type: 'research-output',
    });

    expect(algoliaSearchIndex.saveObject).toBeCalledWith({
      indexName: INDEX_NAME,
      body: {
        ...researchOutput,
        objectID: researchOutput.id,
        __meta: { type: 'research-output' },
      },
    });
  });

  test('Should save the User', async () => {
    const user = createUserResponse();
    algoliaSearchIndex.saveObject.mockResolvedValueOnce({} as never);

    await algoliaSearchClient.save({
      data: user,
      type: 'user',
    });

    expect(algoliaSearchIndex.saveObject).toBeCalledWith({
      indexName: INDEX_NAME,
      body: {
        ...user,
        objectID: user.id,
        __meta: { type: 'user' },
      },
    });
  });

  test('Should remove the entity', async () => {
    const researchOutputId = '1';
    algoliaSearchIndex.deleteObject.mockResolvedValueOnce({} as never);

    await algoliaSearchClient.remove(researchOutputId);

    expect(algoliaSearchIndex.deleteObject).toBeCalledWith({
      indexName: INDEX_NAME,
      objectID: researchOutputId,
    });
  });

  test('Should search research-output entity', async () => {
    algoliaSearchIndex.searchSingleIndex.mockResolvedValueOnce(
      searchResearchOutputResponse,
    );

    const response = await algoliaSearchClient.search(
      ['research-output'],
      'query',
      {
        hitsPerPage: 10,
        page: 0,
        filters: 'some-filters',
      },
    );

    expect(response).toEqual({
      ...searchResearchOutputResponse,
      index: INDEX_NAME,
    });
    expect(algoliaSearchIndex.searchSingleIndex).toBeCalledWith({
      indexName: INDEX_NAME,
      searchParams: {
        query: 'query',
        hitsPerPage: 10,
        page: 0,
        filters: 'some-filters AND (__meta.type:"research-output")',
      },
    });
  });

  test('Should throw Error when search throws', async () => {
    algoliaSearchIndex.searchSingleIndex.mockRejectedValue({
      message: 'Some Algolia ERROR',
    });

    await expect(
      algoliaSearchClient.search(['research-output'], 'query', {
        hitsPerPage: 10,
        page: 0,
        filters: 'some-filters',
      }),
    ).rejects.toThrow(new Error('Could not search: Some Algolia ERROR'));
  });

  test('Should search user entity', async () => {
    algoliaSearchIndex.searchSingleIndex.mockResolvedValueOnce(
      searchUserResponse,
    );

    const response = await algoliaSearchClient.search(['user'], 'query');

    expect(response).toEqual({ ...searchUserResponse, index: INDEX_NAME });
    expect(algoliaSearchIndex.searchSingleIndex).toBeCalledWith({
      indexName: INDEX_NAME,
      searchParams: {
        query: 'query',
        filters: '__meta.type:"user"',
      },
    });
  });

  test('Should search event entity in the past', async () => {
    algoliaSearchIndex.searchSingleIndex.mockResolvedValueOnce(
      searchEventResponse,
    );

    const response = await algoliaSearchClient.search(
      ['event'],
      'query',
      {},
      true,
    );

    expect(response).toEqual({
      ...searchEventResponse,
      index: REVERSE_INDEX_NAME,
    });
    expect(algoliaSearchIndex.searchSingleIndex).toBeCalledWith({
      indexName: REVERSE_INDEX_NAME,
      searchParams: {
        query: 'query',
        filters: '__meta.type:"event"',
      },
    });
  });

  test('Should search multiple entities', async () => {
    algoliaSearchIndex.searchSingleIndex.mockResolvedValueOnce(
      searchUserResponse,
    );

    const response = await algoliaSearchClient.search(
      ['user', 'external-author'],
      'query',
      {
        filters: 'some-filters',
      },
    );

    expect(response).toEqual({ ...searchUserResponse, index: INDEX_NAME });
    expect(algoliaSearchIndex.searchSingleIndex).toBeCalledWith({
      indexName: INDEX_NAME,
      searchParams: {
        query: 'query',
        filters:
          'some-filters AND (__meta.type:"user" OR __meta.type:"external-author")',
      },
    });
  });

  test('Should do facet value search', async () => {
    algoliaSearchIndex.searchForFacetValues.mockResolvedValueOnce({
      facetHits: [],
      exhaustiveFacetsCount: true,
    });

    await algoliaSearchClient.searchForTagValues(
      ['research-output'],
      'query',
      {},
    );

    expect(algoliaSearchIndex.searchForFacetValues).toBeCalledWith({
      indexName: INDEX_NAME,
      facetName: '_tags',
      searchForFacetValuesRequest: expect.objectContaining({
        facetQuery: 'query',
        filters: '__meta.type:"research-output"',
      }),
    });
  });

  test('Should throw Error when facet search throws', async () => {
    algoliaSearchIndex.searchForFacetValues.mockRejectedValue({
      message: 'Some Algolia ERROR',
    });
    await expect(
      algoliaSearchClient.searchForTagValues(['research-output'], 'query', {
        hitsPerPage: 10,
        page: 0,
        filters: 'some-filters',
      }),
    ).rejects.toThrow(
      new Error('Could not search for facet values: Some Algolia ERROR'),
    );
  });

  test('Should do facet value search with tags', async () => {
    algoliaSearchIndex.searchForFacetValues.mockResolvedValueOnce({
      facetHits: [],
      exhaustiveFacetsCount: true,
    });

    await algoliaSearchClient.searchForTagValues(['research-output'], 'query', {
      tagFilters: ['tag1', 'tag2'],
    });

    expect(algoliaSearchIndex.searchForFacetValues).toBeCalledWith({
      indexName: INDEX_NAME,
      facetName: '_tags',
      searchForFacetValuesRequest: expect.objectContaining({
        tagFilters: ['tag1', 'tag2'],
      }),
    });
  });
});

const searchResearchOutputResponse: ClientSearchResponse<
  'crn',
  'research-output'
> = {
  hits: [
    {
      ...createResearchOutputResponse(),
      objectID: '1',
      __meta: { type: 'research-output' },
    },
  ],
  page: 0,
  nbHits: 2,
  nbPages: 1,
  hitsPerPage: 10,
  processingTimeMS: 1000,
  exhaustiveNbHits: true,
  query: 'query',
  params: '',
};

const searchUserResponse: ClientSearchResponse<'crn', 'user'> = {
  hits: [
    {
      ...createUserResponse(),
      objectID: '1',
      __meta: { type: 'user' },
    },
  ],
  page: 0,
  nbHits: 2,
  nbPages: 1,
  hitsPerPage: 10,
  processingTimeMS: 1000,
  exhaustiveNbHits: true,
  query: 'query',
  params: '',
};

const searchEventResponse: ClientSearchResponse<'crn', 'event'> = {
  hits: [
    {
      ...createEventResponse(),
      objectID: '1',
      __meta: { type: 'event' },
    },
  ],
  page: 0,
  nbHits: 2,
  nbPages: 1,
  hitsPerPage: 10,
  processingTimeMS: 1000,
  exhaustiveNbHits: true,
  query: 'query',
  params: '',
};
