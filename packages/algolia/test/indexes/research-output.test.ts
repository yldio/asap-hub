import { SearchIndex as AlgoliaSearchIndex } from 'algoliasearch';
import { DeleteResponse, SaveObjectResponse } from '@algolia/client-search';
import { createResearchOutputResponse } from '@asap-hub/fixtures';

import { ResearchOutputSearchIndex } from '../../src/indexes/research-output';

const saveObjectResponse: SaveObjectResponse = {
  taskID: 1,
  objectID: '1'
};

const deleteObjectResponse: DeleteResponse = {
  taskID: 1
};

const getAlgoliaSearchIndexMock = () => ({
  saveObject: (): SaveObjectResponse => saveObjectResponse,
  deleteObject: (): DeleteResponse => deleteObjectResponse,
} as unknown as AlgoliaSearchIndex);

describe('Research Outputs Index', () => {
  it('should save entity', async () => {
    const algoliaSearchIndexMock = getAlgoliaSearchIndexMock();
    const algoliaSaveObjectSpy = jest.spyOn(algoliaSearchIndexMock, 'saveObject');

    const researchOutputSearchIndex = new ResearchOutputSearchIndex(algoliaSearchIndexMock);

    const researchOutput = createResearchOutputResponse();
    const response = await researchOutputSearchIndex.save(researchOutput);

    expect(response).toEqual(saveObjectResponse);
    expect(algoliaSaveObjectSpy).toBeCalledWith({
      ...researchOutput,
      objectID: researchOutput.id,
      __meta: { 'type': 'research-output' },
    });
  });

  it('should remove entity', async () => {
    const algoliaSearchIndexMock = getAlgoliaSearchIndexMock();
    const algoliaSaveObjectSpy = jest.spyOn(algoliaSearchIndexMock, 'deleteObject');

    const researchOutputSearchIndex = new ResearchOutputSearchIndex(algoliaSearchIndexMock);

    const researchOutputId = '1';
    const response = await researchOutputSearchIndex.remove(researchOutputId);

    expect(response).toEqual(deleteObjectResponse);
    expect(algoliaSaveObjectSpy).toBeCalledWith(researchOutputId);
  });
});
