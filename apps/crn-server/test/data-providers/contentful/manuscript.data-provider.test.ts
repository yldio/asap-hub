import {
  Entry,
  Environment,
  getContentfulGraphqlClientMockServer,
} from '@asap-hub/contentful';
import { GraphQLError } from 'graphql';
import { when } from 'jest-when';

import { ManuscriptContentfulDataProvider } from '../../../src/data-providers/contentful/manuscript.data-provider';
import {
  getContentfulGraphqlManuscript,
  getContentfulGraphqlManuscriptVersions,
  getManuscriptCreateDataObject,
  getManuscriptDataObject,
} from '../../fixtures/manuscript.fixtures';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';
import { getContentfulEnvironmentMock } from '../../mocks/contentful-rest-client.mock';

describe('Manuscripts Contentful Data Provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
  const environmentMock = getContentfulEnvironmentMock();
  const contentfulRestClientMock: () => Promise<Environment> = () =>
    Promise.resolve(environmentMock);

  const manuscriptDataProvider = new ManuscriptContentfulDataProvider(
    contentfulGraphqlClientMock,
    contentfulRestClientMock,
  );

  const contentfulGraphqlClientMockServer =
    getContentfulGraphqlClientMockServer({
      Manuscripts: () => getContentfulGraphqlManuscript(),
      ManuscriptsVersionsCollection: () =>
        getContentfulGraphqlManuscriptVersions(),
    });

  const manuscriptDataProviderMockGraphql =
    new ManuscriptContentfulDataProvider(
      contentfulGraphqlClientMockServer,
      contentfulRestClientMock,
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Fetch method', () => {
    test('should throw an error', async () => {
      await expect(manuscriptDataProvider.fetch()).rejects.toThrow(
        'Method not implemented.',
      );
    });
  });

  describe('Fetch-by-id', () => {
    test('Should fetch the manuscript from Contentful GraphQl', async () => {
      const manuscriptId = 'manuscript-id-1';
      const result =
        await manuscriptDataProviderMockGraphql.fetchById(manuscriptId);

      expect(result).toMatchObject(getManuscriptDataObject());
    });

    test('should default null values to empty strings and arrays', async () => {
      const manuscript = getContentfulGraphqlManuscript();
      manuscript.title = null;
      manuscript.teamsCollection = null;
      manuscript.versionsCollection = null;

      contentfulGraphqlClientMock.request.mockResolvedValue({
        manuscripts: manuscript,
      });

      const result = await manuscriptDataProvider.fetchById('1');
      expect(result).toEqual({
        id: 'manuscript-id-1',
        teamId: '',
        title: '',
        versions: [],
      });
    });

    test('should skip versions with invalid type', async () => {
      const manuscript = getContentfulGraphqlManuscript();
      manuscript.versionsCollection!.items[0]!.type = 'invalid type';

      contentfulGraphqlClientMock.request.mockResolvedValue({
        manuscripts: manuscript,
      });

      const result = await manuscriptDataProvider.fetchById('1');
      expect(result!.versions).toEqual([]);
    });

    test('returns null if query does not return a result', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValue({
        manuscripts: null,
      });

      const result = await manuscriptDataProvider.fetchById('1');
      expect(result).toBeNull();
    });

    test('Should throw an error with a specific error message when the graphql client throws one', async () => {
      const id = 'some-id';
      contentfulGraphqlClientMock.request.mockRejectedValueOnce(
        new GraphQLError('some error message'),
      );

      await expect(manuscriptDataProvider.fetchById(id)).rejects.toThrow(
        'some error message',
      );
    });
  });

  describe('Create', () => {
    test('should throw if no versions are provided', async () => {
      const manuscriptCreateDataObject = getManuscriptCreateDataObject();
      manuscriptCreateDataObject.versions = [];
      await expect(
        manuscriptDataProvider.create(manuscriptCreateDataObject),
      ).rejects.toThrow('No versions provided');
    });

    test('can create a manuscript', async () => {
      const manuscriptId = 'manuscript-id-1';
      const manuscriptVersionId = 'manuscript-version-id-1';
      const publish = jest.fn();

      when(environmentMock.createEntry)
        .calledWith('manuscriptVersions', expect.anything())
        .mockResolvedValue({
          sys: { id: manuscriptVersionId },
          publish,
        } as unknown as Entry);
      when(environmentMock.createEntry)
        .calledWith('manuscripts', expect.anything())
        .mockResolvedValue({
          sys: { id: manuscriptId },
          publish,
        } as unknown as Entry);

      const manuscriptCreateDataObject = getManuscriptCreateDataObject();
      const result = await manuscriptDataProvider.create(
        manuscriptCreateDataObject,
      );

      expect(environmentMock.createEntry).toHaveBeenNthCalledWith(
        1,
        'manuscriptVersions',
        {
          fields: {
            type: {
              'en-US': manuscriptCreateDataObject.versions[0]!.type,
            },
            lifecycle: {
              'en-US': manuscriptCreateDataObject.versions[0]!.lifecycle,
            },
          },
        },
      );
      expect(environmentMock.createEntry).toHaveBeenCalledWith('manuscripts', {
        fields: {
          title: {
            'en-US': 'Manuscript Title',
          },
          teams: {
            'en-US': [
              {
                sys: {
                  id: 'team-1',
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
            ],
          },
          versions: {
            'en-US': [
              {
                sys: {
                  id: manuscriptVersionId,
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
            ],
          },
        },
      });
      expect(publish).toHaveBeenCalled();
      expect(result).toEqual(manuscriptId);
    });
  });
});
