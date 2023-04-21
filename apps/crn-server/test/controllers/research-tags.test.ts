import ResearchTags from '../../src/controllers/research-tags';
import { ResearchTagDataProvider } from '../../src/data-providers/research-tags.data-provider';
import {
  getResearchTagDataObject,
  getResearchTagResponse,
} from '../fixtures/research-tag.fixtures';
import { getDataProviderMock } from '../mocks/data-provider.mock';

describe('ResearchTags controller', () => {
  const researchTagDataProvider = getDataProviderMock();
  const researchTags = new ResearchTags(researchTagDataProvider);

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch method', () => {
    test('Should return an empty list when there are no research tags', async () => {
      researchTagDataProvider.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });
      const result = await researchTags.fetch({});

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should return the research tags', async () => {
      researchTagDataProvider.fetch.mockResolvedValueOnce({
        total: 1,
        items: [getResearchTagDataObject()],
      });

      const result = await researchTags.fetch({});

      expect(result).toEqual({
        items: [getResearchTagResponse()],
        total: 1,
      });
    });

    test('Should call the data provider with correct parameters', async () => {
      await researchTags.fetch({
        take: 10,
        skip: 5,
        filter: { entity: 'Research Output', type: 'some-type' },
      });

      const expectedParameters: Parameters<
        ResearchTagDataProvider['fetch']
      >[0] = {
        filter: { entity: 'Research Output', type: 'some-type' },
        skip: 5,
        take: 10,
      };
      expect(researchTagDataProvider.fetch).toHaveBeenCalledWith(
        expectedParameters,
      );
    });
  });
});
