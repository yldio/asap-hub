import ResearchTags from '../../src/controllers/research-tags.controller';
import { ResearchTagDataProvider } from '../../src/data-providers/types';
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

  describe('Fetch All method', () => {
    test('Should return an empty list when there are no research tags', async () => {
      researchTagDataProvider.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });
      const result = await researchTags.fetchAll({});

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should return all research tags', async () => {
      researchTagDataProvider.fetch.mockResolvedValue({
        total: 2,
        items: [getResearchTagDataObject()],
      });

      const result = await researchTags.fetchAll({});

      expect(result).toEqual({
        items: [getResearchTagDataObject(), getResearchTagDataObject()],
        total: 2,
      });
    });

    test('Should pass the pagination parameters as expected', async () => {
      const tags = {
        items: Array.from({ length: 200 }, getResearchTagDataObject),
        total: 400,
      };

      researchTagDataProvider.fetch.mockResolvedValue(tags);

      await researchTags.fetchAll({
        filter: { entity: 'Research Output', type: 'some-type' },
      });

      expect(researchTagDataProvider.fetch).toHaveBeenCalledWith({
        take: 200,
        skip: 0,
        filter: { entity: 'Research Output', type: 'some-type' },
      });

      expect(researchTagDataProvider.fetch).toHaveBeenCalledWith({
        take: 200,
        skip: 200,
        filter: { entity: 'Research Output', type: 'some-type' },
      });
    });

    test('Should pass the entity filter parameters as expected', async () => {
      const tags = {
        items: [],
        total: 0,
      };

      researchTagDataProvider.fetch.mockResolvedValue(tags);

      await researchTags.fetchAll({
        filter: {
          entity: 'Research Output',
        },
      });

      expect(researchTagDataProvider.fetch).toHaveBeenCalledWith({
        take: 200,
        skip: 0,
        filter: {
          entity: 'Research Output',
        },
      });
    });

    test('Should pass the type filter parameters as expected', async () => {
      const tags = {
        items: [],
        total: 0,
      };

      researchTagDataProvider.fetch.mockResolvedValue(tags);

      await researchTags.fetchAll({
        filter: {
          type: 'Software',
        },
      });

      expect(researchTagDataProvider.fetch).toHaveBeenCalledWith({
        take: 200,
        skip: 0,
        filter: {
          type: 'Software',
        },
      });
    });

    test('Should pass the both filters parameters as expected', async () => {
      const tags = {
        items: [],
        total: 0,
      };

      researchTagDataProvider.fetch.mockResolvedValue(tags);

      await researchTags.fetchAll({
        filter: {
          entity: 'Research Output',
          type: 'Software',
        },
      });

      expect(researchTagDataProvider.fetch).toHaveBeenCalledWith({
        take: 200,
        skip: 0,
        filter: {
          entity: 'Research Output',
          type: 'Software',
        },
      });
    });
  });
});
