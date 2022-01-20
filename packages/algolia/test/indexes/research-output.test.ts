import { SearchIndex as AlgoliaSearchIndex } from 'algoliasearch';
import { DeleteResponse, SaveObjectResponse } from '@algolia/client-search';
import { createResearchOutputResponse } from '@asap-hub/fixtures';

import {
  ResearchOutputSearchIndex,
  ResearchOutputSearchResponse,
} from '../../src/indexes/research-output';

const saveObjectResponse: SaveObjectResponse = {
  taskID: 1,
  objectID: '1',
};

const deleteObjectResponse: DeleteResponse = {
  taskID: 1,
};

const searchResponse: ResearchOutputSearchResponse = {
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

const getAlgoliaSearchIndexMock = () =>
  ({
    saveObject: (): SaveObjectResponse => saveObjectResponse,
    deleteObject: (): DeleteResponse => deleteObjectResponse,
    search: async (): Promise<ResearchOutputSearchResponse> => searchResponse,
  } as unknown as AlgoliaSearchIndex);

describe('Research Outputs Index', () => {
  it('should save entity', async () => {
    const algoliaSearchIndexMock = getAlgoliaSearchIndexMock();
    const algoliaSaveObjectSpy = jest.spyOn(
      algoliaSearchIndexMock,
      'saveObject',
    );

    const researchOutputSearchIndex = new ResearchOutputSearchIndex(
      algoliaSearchIndexMock,
    );

    const researchOutput = createResearchOutputResponse();
    const response = await researchOutputSearchIndex.save(researchOutput);

    expect(response).toEqual(saveObjectResponse);
    expect(algoliaSaveObjectSpy).toBeCalledWith({
      ...researchOutput,
      objectID: researchOutput.id,
      __meta: { type: 'research-output' },
    });
  });

  it('should remove entity', async () => {
    const algoliaSearchIndexMock = getAlgoliaSearchIndexMock();
    const algoliaSaveObjectSpy = jest.spyOn(
      algoliaSearchIndexMock,
      'deleteObject',
    );

    const researchOutputSearchIndex = new ResearchOutputSearchIndex(
      algoliaSearchIndexMock,
    );

    const researchOutputId = '1';
    const response = await researchOutputSearchIndex.remove(researchOutputId);

    expect(response).toEqual(deleteObjectResponse);
    expect(algoliaSaveObjectSpy).toBeCalledWith(researchOutputId);
  });

  it('should perform search', async () => {
    const algoliaSearchIndexMock = getAlgoliaSearchIndexMock();
    const algoliaSearchSpy = jest.spyOn(algoliaSearchIndexMock, 'search');

    const researchOutputSearchIndex = new ResearchOutputSearchIndex(
      algoliaSearchIndexMock,
    );

    const response = await researchOutputSearchIndex.search('query', {
      hitsPerPage: 10,
      page: 0,
      filters: 'some-filters',
    });

    expect(response).toEqual(searchResponse);
    expect(algoliaSearchSpy).toBeCalledWith('query', {
      hitsPerPage: 10,
      page: 0,
      filters: 'some-filters AND __meta.type:"research-output"',
    });
  });

  it('should perform search without filters', async () => {
    const algoliaSearchIndexMock = getAlgoliaSearchIndexMock();
    const algoliaSearchSpy = jest.spyOn(algoliaSearchIndexMock, 'search');

    const researchOutputSearchIndex = new ResearchOutputSearchIndex(
      algoliaSearchIndexMock,
    );

    const response = await researchOutputSearchIndex.search('query', {
      hitsPerPage: 10,
      page: 0
    });

    expect(response).toEqual(searchResponse);
    expect(algoliaSearchSpy).toBeCalledWith('query', {
      hitsPerPage: 10,
      page: 0,
      filters: '__meta.type:"research-output"',
    });
  });
});
