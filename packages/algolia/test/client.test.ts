import { SearchResponse } from '@algolia/client-search';
import {
  createResearchOutputResponse,
  createUserResponse,
} from '@asap-hub/fixtures';
import { AlgoliaSearchClient, EntityRecord } from '../src/client';
import { getAlgoliaSearchIndexMock } from './mocks/algolia.mocks';

describe('Algolia Search Client', () => {
  const algoliaSearchIndex = getAlgoliaSearchIndexMock();
  const algoliaSearchClient = new AlgoliaSearchClient(algoliaSearchIndex);

  test('Should save the Research Output', async () => {
    const researchOutput = createResearchOutputResponse();

    await algoliaSearchClient.save(researchOutput);

    expect(algoliaSearchIndex.saveObject).toBeCalledWith({
      ...researchOutput,
      objectID: researchOutput.id,
      __meta: { type: 'research-output' },
    });
  });

  test('Should save the User', async () => {
    const user = createUserResponse();

    await algoliaSearchClient.save(user);

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

    const response = await algoliaSearchClient.searchEntity(
      'research-output',
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
      filters: 'some-filters AND __meta.type:"research-output"',
    });
  });

  test('Should search user entity', async () => {
    algoliaSearchIndex.search.mockResolvedValueOnce(searchUserResponse);

    const response = await algoliaSearchClient.searchEntity('user', 'query');

    expect(response).toEqual(searchUserResponse);
    expect(algoliaSearchIndex.search).toBeCalledWith('query', {
      filters: '__meta.type:"user"',
    });
  });
});

const searchResearchOutputResponse: SearchResponse<
  EntityRecord<'research-output'>
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

const searchUserResponse: SearchResponse<EntityRecord<'user'>> = {
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
