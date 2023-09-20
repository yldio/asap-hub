import { TutorialDataProvider } from '../../../src/data-providers/types';
import { TutorialContentfulDataProvider } from '../../../src/data-providers/contentful/tutorial.data-provider';
import {
  FetchTutorialByIdQuery,
  getContentfulGraphqlClientMockServer,
} from '@asap-hub/contentful';
import { TutorialsDataObject } from '@asap-hub/model';
import {
  getTutorialsDataObject,
  getContentfulGraphqlTutorial,
} from '../../fixtures/tutorials.fixtures';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';

describe('Tutorials data provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
  const dataProvider: TutorialDataProvider = new TutorialContentfulDataProvider(
    contentfulGraphqlClientMock,
  );

  describe('Fetch', () => {
    test('not implemented', async () => {
      await expect(dataProvider.fetch(null)).rejects.toThrow();
    });
  });

  describe('Fetch by ID', () => {
    test('it should return the tutorial from the mock server', async () => {
      const graphqlTutorialResponse = getContentfulGraphqlTutorial();
      const contentfulGraphqlClientMockServer =
        getContentfulGraphqlClientMockServer({
          Tutorials: () => graphqlTutorialResponse,
          TutorialsCollection: () => {
            return graphqlTutorialResponse.linkedFrom?.tutorialsCollection;
          },
          RelatedTutorialsCollection: () => {
            return graphqlTutorialResponse.relatedTutorialsCollection;
          },
        });
      const dataProviderWithMockServer: TutorialDataProvider =
        new TutorialContentfulDataProvider(contentfulGraphqlClientMockServer);
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

    test('Should default sharingStatus to Network Only when missing', async () => {
      const tutorials = getContentfulGraphqlTutorial();
      tutorials.sharingStatus = null;
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        tutorials,
      });

      const result = await dataProvider.fetchById('123');

      expect(result!.sharingStatus).toEqual('Network Only');
    });

    test('Should return a mix of internal and external authors', async () => {
      const tutorials = getContentfulGraphqlTutorial();
      const user1 = {
        sys: { id: 'user-id-0' },
        firstName: 'Test',
        lastName: 'User',
        email: 'user0@example.com',
        onboarded: true,
        orcid: '1111-2222-3333-4444',
        avatar: {
          url: 'https://example.com/user-id-0',
        },
        alumniSinceDate: null,
        __typename: 'Users',
      } as InternalUser;
      const user2 = {
        sys: { id: 'user-id-1' },
        firstName: 'Test',
        lastName: 'User',
        email: 'user1@example.com',
        onboarded: true,
        orcid: '1111-2222-3333-4444',
        avatar: {
          url: 'https://example.com/user-id-1',
        },
        alumniSinceDate: '2023-01-01T12:00:00.000Z',
        __typename: 'Users',
      } as InternalUser;
      const externalAuthor = {
        sys: {
          id: '3099015c-c9ed-40fd-830a-8fe1b6ec0482',
        },
        name: 'test external author',
        orcid: '23423423',
        __typename: 'ExternalAuthors',
      } as ExternalUser;
      tutorials.authorsCollection!.items = [user1, externalAuthor, user2];
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        tutorials,
      });

      const result = await dataProvider.fetchById('123');

      const expectedAuthorsResponse: TutorialsDataObject['authors'] = [
        {
          id: 'user-id-0',
          displayName: 'Test User',
          firstName: 'Test',
          lastName: 'User',
          email: 'user0@example.com',
          avatarUrl: 'https://example.com/user-id-0',
          alumniSinceDate: undefined,
        },
        {
          id: '3099015c-c9ed-40fd-830a-8fe1b6ec0482',
          displayName: 'test external author',
          orcid: '23423423',
        },
        {
          id: 'user-id-1',
          displayName: 'Test User',
          firstName: 'Test',
          lastName: 'User',
          email: 'user1@example.com',
          avatarUrl: 'https://example.com/user-id-1',
          alumniSinceDate: '2023-01-01T12:00:00.000Z',
        },
      ];

      expect(result!.authors).toEqual(expectedAuthorsResponse);
    });

    test('Should default authors to an empty array when missing', async () => {
      const tutorials = getContentfulGraphqlTutorial();
      tutorials.authorsCollection = null;
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        tutorials,
      });

      const result = await dataProvider.fetchById('123');

      expect(result!.authors).toEqual([]);
    });

    test('Should default related events to an empty array when missing', async () => {
      const tutorials = getContentfulGraphqlTutorial();
      tutorials.relatedEventsCollection = null;
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        tutorials,
      });

      const result = await dataProvider.fetchById('123');

      expect(result!.relatedEvents).toEqual([]);
    });

    test('Should default tags to an empty array when missing', async () => {
      const tutorials = getContentfulGraphqlTutorial();
      tutorials.tagsCollection = null;
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        tutorials,
      });

      const result = await dataProvider.fetchById('123');

      expect(result!.tags).toEqual([]);
    });

    test('Should default teams to an empty array when missing', async () => {
      const tutorials = getContentfulGraphqlTutorial();
      tutorials.teamsCollection = null;
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        tutorials,
      });

      const result = await dataProvider.fetchById('123');

      expect(result!.teams).toEqual([]);
    });
  });
});

type Author = NonNullable<
  NonNullable<
    NonNullable<FetchTutorialByIdQuery['tutorials']>['authorsCollection']
  >['items']
>[number];
type InternalUser = Extract<Author, { __typename: 'Users' }>;
type ExternalUser = Extract<Author, { __typename: 'ExternalAuthors' }>;
