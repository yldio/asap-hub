import { GuideDataProvider } from '../../../src/data-providers/types';
import {
  GuideContentfulDataProvider,
  parseGraphQLGuide,
} from '../../../src/data-providers/contentful/guide.data-provider';
import { getContentfulGraphqlClientMockServer } from '@asap-hub/contentful';

import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';
import { getContentfulGraphql } from '../../fixtures/guides.fixture';

describe('Guide data provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
  const dataProvider: GuideDataProvider = new GuideContentfulDataProvider(
    contentfulGraphqlClientMock,
  );

  describe('Fetch', () => {
    test('it should return the guides from the mock server', async () => {
      const contentfulGraphqlClientMockServer =
        getContentfulGraphqlClientMockServer(getContentfulGraphql());
      const dataProviderWithMockServer: GuideDataProvider =
        new GuideContentfulDataProvider(contentfulGraphqlClientMockServer);
      const result = await dataProviderWithMockServer.fetchByCollectionTitle(
        'Home',
      );
      const expectation = {
        items: [
          {
            title: 'Item 1',
            content: [
              {
                title: '',
                text: 'guide content text',
                linkUrl: 'https://example.com',
                linkText: 'link text',
              },
            ],
          },
          {
            title: 'Item 1',
            content: [
              {
                title: '',
                text: 'guide content text',
                linkUrl: 'https://example.com',
                linkText: 'link text',
              },
            ],
          },
        ],
        total: 2,
      };

      expect(result).toMatchObject(expectation);
    });

    test('it should return empty data if no guides collection is found', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        guidesCollection: null,
      });

      const result = await dataProvider.fetchByCollectionTitle('Home');

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('it should return empty data if no guide is found', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        guidesCollection: {
          items: [],
        },
      });

      const result = await dataProvider.fetchByCollectionTitle('Home');

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });
  });
});

describe('parseGraphQLGuide', () => {
  it('returns an empty content array when contentCollection is not available', () => {
    const guideData = {
      title: 'a title',
    };
    expect(parseGraphQLGuide(guideData).content).toStrictEqual([]);
  });
});
