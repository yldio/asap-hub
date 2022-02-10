import { SearchResponse } from '@algolia/client-search';
import { ResearchOutputResponse } from '@asap-hub/model';
import {
  createResearchOutputResponse,
  createUserResponse,
} from '@asap-hub/fixtures';
import {
  AlgoliaSearchClient,
  getEntityType,
  EntityRecord,
  RESEARCH_OUTPUT_ENTITY_TYPE,
  USER_ENTITY_TYPE,
} from '../src/client';
import { getAlgoliaSearchIndexMock } from './mocks/algolia.mocks';

describe('Algolia Search Client', () => {
  const algoliaSearchIndex = getAlgoliaSearchIndexMock();
  const algoliaSearchClient = new AlgoliaSearchClient(algoliaSearchIndex);

  it('Should do batch on entities', async () => {
    await algoliaSearchClient.batch([
      {
        action: 'updateObject',
        body: {
          id: 'ro-id',
          title: 'ro-title',
          sharingStatus: 'Public',
        } as ResearchOutputResponse,
      },
    ]);

    expect(algoliaSearchIndex.batch).toBeCalledWith([
      {
        action: 'updateObject',
        body: {
          id: 'ro-id',
          objectID: 'ro-id',
          title: 'ro-title',
          sharingStatus: 'Public',
          __meta: { type: 'research-output' },
        },
      },
    ]);
  });

  it('Should save the Research Output', async () => {
    const researchOutput = createResearchOutputResponse();

    await algoliaSearchClient.save(researchOutput);

    expect(algoliaSearchIndex.saveObject).toBeCalledWith({
      ...researchOutput,
      objectID: researchOutput.id,
      __meta: { type: 'research-output' },
    });
  });

  it('Should save the User', async () => {
    const user = createUserResponse();

    await algoliaSearchClient.save(user);

    expect(algoliaSearchIndex.saveObject).toBeCalledWith({
      ...user,
      objectID: user.id,
      __meta: { type: 'user' },
    });
  });

  it('Should remove the entity', async () => {
    const researchOutputId = '1';

    await algoliaSearchClient.remove(researchOutputId);

    expect(algoliaSearchIndex.deleteObject).toBeCalledWith(researchOutputId);
  });

  it('Should search research-output entity', async () => {
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

  it('Should search user entity', async () => {
    algoliaSearchIndex.search.mockResolvedValueOnce(searchUserResponse);

    const response = await algoliaSearchClient.searchEntity('user', 'query');

    expect(response).toEqual(searchUserResponse);
    expect(algoliaSearchIndex.search).toBeCalledWith('query', {
      filters: '__meta.type:"user"',
    });
  });

  describe('getEntityType', () => {
    it('should return research-output when it have a title and sharingStatus fields', () => {
      expect(
        getEntityType({
          title: 'test title',
          sharingStatus: 'Public',
        } as ResearchOutputResponse),
      ).toEqual('research-output');
    });

    it('should return user when it does not have a title field', () => {
      expect(getEntityType({} as ResearchOutputResponse)).toEqual('user');
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
