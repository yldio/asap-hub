import ResearchThemeController from '../../src/controllers/research-theme.controller';
import { ResearchThemeDataProvider } from '../../src/data-providers/types';
import {
  getResearchThemeDataObject,
  getResearchThemeResponse,
} from '../fixtures/research-theme.fixtures';
import { getDataProviderMock } from '../mocks/data-provider.mock';

describe('ResearchTheme controller', () => {
  const researchThemeDataProvider = getDataProviderMock();
  const researchThemeController = new ResearchThemeController(
    researchThemeDataProvider,
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch method', () => {
    test('Should return an empty list when there are no research themes', async () => {
      researchThemeDataProvider.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });
      const result = await researchThemeController.fetch({});

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should return the research themes', async () => {
      researchThemeDataProvider.fetch.mockResolvedValueOnce({
        total: 1,
        items: [getResearchThemeDataObject()],
      });

      const result = await researchThemeController.fetch({});

      expect(result).toEqual({
        items: [getResearchThemeResponse()],
        total: 1,
      });
    });

    test('Should call the data provider with correct parameters', async () => {
      await researchThemeController.fetch({
        take: 10,
        skip: 5,
      });

      const expectedParameters: Parameters<
        ResearchThemeDataProvider['fetch']
      >[0] = {
        skip: 5,
        take: 10,
      };
      expect(researchThemeDataProvider.fetch).toHaveBeenCalledWith(
        expectedParameters,
      );
    });

    test('Should use default parameters when none provided', async () => {
      await researchThemeController.fetch({});

      const expectedParameters: Parameters<
        ResearchThemeDataProvider['fetch']
      >[0] = {
        skip: 0,
        take: 100,
      };
      expect(researchThemeDataProvider.fetch).toHaveBeenCalledWith(
        expectedParameters,
      );
    });
  });
});
