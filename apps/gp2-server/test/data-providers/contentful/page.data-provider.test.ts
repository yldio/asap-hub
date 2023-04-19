import { getContentfulGraphqlClientMockServer } from '@asap-hub/contentful';
import { PageContentfulDataProvider } from '../../../src/data-providers/contentful/page.data-provider';
import {
  getContentfulGraphqlPages,
  getContentfulPagesGraphqlResponse,
} from '../../fixtures/page.fixtures';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';

describe('Pages Contentful Data Provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();

  const pageDataProvider = new PageContentfulDataProvider(
    contentfulGraphqlClientMock,
  );

  const contentfulGraphqlClientMockServer =
    getContentfulGraphqlClientMockServer({
      Pages: () => getContentfulGraphqlPages(),
    });

  const pageDataProviderMockGraphql = new PageContentfulDataProvider(
    contentfulGraphqlClientMockServer,
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Fetch method', () => {
    test('Should fetch the list of Pages from Contentful GraphQl', async () => {
      const result = await pageDataProviderMockGraphql.fetch({});

      expect(result).toMatchObject({
        total: 1,
        items: [
          {
            id: 'some-id',
            path: '/privacy-policy',
            shortText: 'short text',
            text: '<h1>Privacy Policy</h1>',
            title: 'Privacy Policy',
            link: 'link',
            linkText: 'linkText',
          },
        ],
      });
    });

    test('Should return an empty result when no pages are found', async () => {
      const contentfulPagesGraphqlResponse =
        getContentfulPagesGraphqlResponse();
      contentfulPagesGraphqlResponse.pagesCollection!.total = 0;
      contentfulPagesGraphqlResponse.pagesCollection!.items = [];
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulPagesGraphqlResponse,
      );

      const result = await pageDataProvider.fetch();

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should return an empty result when the client returns a response with query property set to null', async () => {
      const contentfulPagesGraphqlResponse =
        getContentfulPagesGraphqlResponse();
      contentfulPagesGraphqlResponse.pagesCollection = null;
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulPagesGraphqlResponse,
      );

      const result = await pageDataProvider.fetch();

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should filter pages by path', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        getContentfulPagesGraphqlResponse(),
      );

      await pageDataProvider.fetch({ filter: { path: '/privacy-policy' } });

      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          where: { path: '/privacy-policy' },
        },
      );
    });
  });
});
