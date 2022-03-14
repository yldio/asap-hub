import { SearchResponse } from '@algolia/client-search';
import {
  ExternalAuthorResponse,
  LabResponse,
  ResearchOutputResponse,
  UserResponse,
} from '@asap-hub/model';
import {
  createResearchOutputResponse,
  createUserResponse,
} from '@asap-hub/fixtures';
import {
  AlgoliaSearchClient,
  EntityRecord,
  RESEARCH_OUTPUT_ENTITY_TYPE,
  USER_ENTITY_TYPE,
} from '../src/client';
import { getAlgoliaSearchIndexMock } from './mocks/algolia.mocks';

describe('Algolia Search Client', () => {
  const algoliaSearchIndex = getAlgoliaSearchIndexMock();
  const algoliaSearchClient = new AlgoliaSearchClient(algoliaSearchIndex);

  test('Should do save many on entities', async () => {
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

    expect(algoliaSearchIndex.saveObjects).toBeCalledWith([
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
    ]);
  });

  test('Should save the Research Output', async () => {
    const researchOutput = createResearchOutputResponse();

    await algoliaSearchClient.save({
      data: researchOutput,
      type: 'research-output',
    });

    expect(algoliaSearchIndex.saveObject).toBeCalledWith({
      ...researchOutput,
      objectID: researchOutput.id,
      __meta: { type: 'research-output' },
    });
  });

  test('Should save the User', async () => {
    const user = createUserResponse();

    await algoliaSearchClient.save({
      data: user,
      type: 'user',
    });

    expect(algoliaSearchIndex.saveObject).toBeCalledWith({
      ...user,
      objectID: user.id,
      __meta: { type: 'user' },
    });
  });

  test('Should remove the entity', async () => {
    const researchOutputId = '1';

    await algoliaSearchClient.remove(researchOutputId);

    expect(algoliaSearchIndex.deleteObject).toBeCalledWith(researchOutputId);
  });

  test('Should search research-output entity', async () => {
    algoliaSearchIndex.search.mockResolvedValueOnce(
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

    expect(response).toEqual(searchResearchOutputResponse);
    expect(algoliaSearchIndex.search).toBeCalledWith('query', {
      hitsPerPage: 10,
      page: 0,
      filters: '(some-filters) AND (__meta.type:"research-output")',
    });
  });

  test('Should search user entity', async () => {
    algoliaSearchIndex.search.mockResolvedValueOnce(searchUserResponse);

    const response = await algoliaSearchClient.search(['user'], 'query');

    expect(response).toEqual(searchUserResponse);
    expect(algoliaSearchIndex.search).toBeCalledWith('query', {
      filters: '__meta.type:"user"',
    });
  });

  test('Should search multiple entities', async () => {
    algoliaSearchIndex.search.mockResolvedValueOnce(searchUserResponse);

    const response = await algoliaSearchClient.search(
      ['user', 'external-author', 'lab'],
      'query',
      {
        filters: 'some-filters',
      },
    );

    expect(response).toEqual(searchUserResponse);
    expect(algoliaSearchIndex.search).toBeCalledWith('query', {
      filters:
        '(some-filters) AND (__meta.type:"user" OR __meta.type:"external-author" OR __meta.type:"lab")',
    });
  });
});

const searchResearchOutputResponse: SearchResponse<
  EntityRecord<typeof RESEARCH_OUTPUT_ENTITY_TYPE>
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

const searchUserResponse: SearchResponse<
  EntityRecord<typeof USER_ENTITY_TYPE>
> = {
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
