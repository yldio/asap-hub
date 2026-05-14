import ResearchThemeController from '../../src/controllers/research-theme.controller';
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

      expect(researchThemeDataProvider.fetch).toHaveBeenCalledWith({
        skip: 5,
        take: 10,
        filter: undefined,
      });
    });

    test('Should forward the types filter to the data provider', async () => {
      await researchThemeController.fetch({
        filter: { types: ['Resource'] },
      });

      expect(researchThemeDataProvider.fetch).toHaveBeenCalledWith(
        expect.objectContaining({ filter: { types: ['Resource'] } }),
      );
    });

    test('Should use default parameters when none provided', async () => {
      await researchThemeController.fetch({});

      expect(researchThemeDataProvider.fetch).toHaveBeenCalledWith({
        skip: 0,
        take: 100,
        filter: undefined,
      });
    });

    test('Should use default parameter when fetch is called without arguments', async () => {
      researchThemeDataProvider.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });

      await researchThemeController.fetch();

      expect(researchThemeDataProvider.fetch).toHaveBeenCalledWith({
        skip: 0,
        take: 100,
        filter: undefined,
      });
    });
  });
});
