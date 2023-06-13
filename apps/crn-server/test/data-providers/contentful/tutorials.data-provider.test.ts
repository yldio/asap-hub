import { TutorialsDataProvider } from '../../../src/data-providers/types';
import { TutorialsContentfulDataProvider } from '../../../src/data-providers/contentful/tutorials.data-provider';
import { getContentfulGraphqlClientMockServer } from '@asap-hub/contentful';
import {
  getTutorialsDataObject,
  getContentfulGraphqlTutorial,
} from '../../fixtures/tutorials.fixtures';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';

describe('Tutorials data provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
  const dataProvider: TutorialsDataProvider =
    new TutorialsContentfulDataProvider(contentfulGraphqlClientMock);

  describe('Fetch', () => {
    test('not implemented', async () => {
      expect(async () => dataProvider.fetch(null)).rejects.toThrow();
    });
  });

  describe('Fetch by ID', () => {
    test('it should return the tutorial from the mock server', async () => {
      const contentfulGraphqlClientMockServer =
        getContentfulGraphqlClientMockServer({
          Tutorials: () => getContentfulGraphqlTutorial(),
        });
      const dataProviderWithMockServer: TutorialsDataProvider =
        new TutorialsContentfulDataProvider(contentfulGraphqlClientMockServer);
      const result = await dataProviderWithMockServer.fetchById('123');

      const expectation = getTutorialsDataObject();

      expect(result).toEqual(expectation);
    });

    test('parses rich text into html', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        tutorials: {
          ...getContentfulGraphqlTutorial(),
          text: {
            json: {
              nodeType: 'document',
              data: {},
              content: [
                {
                  nodeType: 'paragraph',
                  data: {},
                  content: [
                    {
                      nodeType: 'text',
                      value: 'rich text',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
            links: {
              entries: {
                inline: [],
              },
              assets: {
                block: [],
              },
            },
          },
        },
      });

      const result = await dataProvider.fetchById('123');

      expect(result!.text).toEqual('<p>rich text</p>');
    });

    test('it should return null if the tutorial is not found', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        tutorials: null,
      });

      const result = await dataProvider.fetchById('123');

      expect(result).toEqual(null);
    });

    test('returns an empty string for the title if it is not set', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        tutorials: {
          ...getContentfulGraphqlTutorial(),
          title: null,
        },
      });

      const result = await dataProvider.fetchById('123');

      expect(result!.title).toEqual('');
    });

    test('returns undefined for fields if they are not set', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        tutorials: {
          ...getContentfulGraphqlTutorial(),
          link: null,
          text: null,
          linkText: null,
          shortText: null,
        },
      });

      const result = await dataProvider.fetchById('123');

      expect(result!.link).toEqual(undefined);
      expect(result!.text).toEqual(undefined);
      expect(result!.linkText).toEqual(undefined);
      expect(result!.shortText).toEqual(undefined);
    });
  });
});
