import { getContentfulGraphqlClientMockServer } from '@asap-hub/contentful';
import { ResearchThemeContentfulDataProvider } from '../../../src/data-providers/contentful/research-theme.data-provider';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';

describe('Research Themes Data Provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
  const researchThemesDataProvider = new ResearchThemeContentfulDataProvider(
    contentfulGraphqlClientMock,
  );

  const getContentfulGraphqlResearchThemeResponse = () => ({
    total: 3,
    items: [
      { sys: { id: 'theme-1' }, name: 'Neurodegeneration' },
      { sys: { id: 'theme-2' }, name: 'Cell Biology' },
      { sys: { id: 'theme-3' }, name: 'Genetics' },
    ],
  });

  const contentfulGraphqlClientMockServer =
    getContentfulGraphqlClientMockServer({
      ResearchThemeCollection: () =>
        getContentfulGraphqlResearchThemeResponse(),
    });

  const researchThemesDataProviderMockGraphql =
    new ResearchThemeContentfulDataProvider(contentfulGraphqlClientMockServer);

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch method', () => {
    test('can fetch data from mock graphql server', async () => {
      const result = await researchThemesDataProviderMockGraphql.fetch({});
      expect(result).toEqual({
        total: 3,
        items: [
          { id: 'theme-1', name: 'Neurodegeneration' },
          { id: 'theme-2', name: 'Cell Biology' },
          { id: 'theme-3', name: 'Genetics' },
        ],
      });
    });

    test('sets default pagination options if none are provided', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        researchThemeCollection: getContentfulGraphqlResearchThemeResponse(),
      });
      await researchThemesDataProvider.fetch({});
      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ limit: 100, skip: 0 }),
      );
    });

    test('passes pagination options if they are provided', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        researchThemeCollection: getContentfulGraphqlResearchThemeResponse(),
      });
      await researchThemesDataProvider.fetch({ take: 50, skip: 10 });
      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ limit: 50, skip: 10 }),
      );
    });

    test('should return an empty result if contentful returns a null response', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        researchThemeCollection: null,
      });

      const result = await researchThemesDataProvider.fetch({});
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('should return default values if result has null entries', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        researchThemeCollection: {
          total: 1,
          items: [
            {
              sys: {
                id: 'theme-1',
              },
              name: null,
            },
          ],
        },
      });

      const result = await researchThemesDataProvider.fetch({});
      expect(result).toEqual({
        total: 1,
        items: [
          {
            id: 'theme-1',
            name: '',
          },
        ],
      });
    });

    test('should filter out null items from the collection', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        researchThemeCollection: {
          total: 2,
          items: [
            { sys: { id: 'theme-1' }, name: 'Neurodegeneration' },
            null,
            { sys: { id: 'theme-2' }, name: 'Cell Biology' },
          ],
        },
      });

      const result = await researchThemesDataProvider.fetch({});
      expect(result).toEqual({
        total: 2,
        items: [
          { id: 'theme-1', name: 'Neurodegeneration' },
          { id: 'theme-2', name: 'Cell Biology' },
        ],
      });
    });

    test('orders results by name ascending', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        researchThemeCollection: getContentfulGraphqlResearchThemeResponse(),
      });
      await researchThemesDataProvider.fetch({});
      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ order: ['name_ASC'] }),
      );
    });
  });
});
