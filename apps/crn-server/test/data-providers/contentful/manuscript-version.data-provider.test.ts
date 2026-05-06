import {
  Environment,
  getContentfulGraphqlClientMockServer,
} from '@asap-hub/contentful';

import { GraphQLError } from 'graphql';
import { ManuscriptVersionContentfulDataProvider } from '../../../src/data-providers/contentful/manuscript-version.data-provider';
import {
  getEntry,
  getEntryCollection,
} from '../../fixtures/contentful.fixtures';

import {
  getContentfulManuscript,
  getContentfulManuscriptProjectsCollection,
  getContentfulManuscriptsCollection,
  getContentfulManuscriptVersion,
  getContentfulManuscriptVersionFull,
  getManuscriptVersionDataObject,
  getManuscriptVersionsListResponse,
  Version,
} from '../../fixtures/manuscript-versions.fixtures';
import { getContentfulGraphqlManuscriptsCollection } from '../../fixtures/manuscript.fixtures';
import { getContentfulGraphql } from '../../fixtures/teams.fixtures';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';
import { getContentfulEnvironmentMock } from '../../mocks/contentful-rest-client.mock';

describe('Manuscript Versions Contentful Data Provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();

  const manuscriptVersionDataProvider =
    new ManuscriptVersionContentfulDataProvider(contentfulGraphqlClientMock);

  const contentfulGraphqlClientMockServer =
    getContentfulGraphqlClientMockServer({
      ...getContentfulGraphql(),
      ManuscriptsCollection: () => ({
        ...getContentfulManuscriptsCollection(),
        total: 2,
      }),
      ManuscriptsTeamsCollection: () => ({
        ...getContentfulManuscript().teamsCollection,
      }),
      ManuscriptsCategoriesCollection: () => ({
        ...getContentfulManuscript().categoriesCollection,
      }),
      ManuscriptVersionsFirstAuthorsCollection: () => ({
        ...getContentfulManuscriptVersion()?.firstAuthorsCollection,
      }),
      ManuscriptVersionsLabsCollection: () => ({
        ...getContentfulManuscriptVersion()?.labsCollection,
      }),
      ManuscriptsVersionsCollection: () =>
        getContentfulManuscript().versionsCollection,
      ProjectsCollection: () => getContentfulManuscriptProjectsCollection(),
    });

  const manuscriptVersionDataProviderMockGraphql =
    new ManuscriptVersionContentfulDataProvider(
      contentfulGraphqlClientMockServer,
    );

  describe('Fetch', () => {
    test('Should fetch the manuscript versions that are in Preprint, Publication or Publication with addendum or corrigendum lifecycle from Contentful graphql', async () => {
      const result = await manuscriptVersionDataProviderMockGraphql.fetch({});

      const expectedResult = getManuscriptVersionsListResponse();
      expect(result).toMatchObject(expectedResult);
    });

    test('Should return an empty result when the client returns an empty array of data', async () => {
      const contentfulGraphQLResponse =
        getContentfulGraphqlManuscriptsCollection();
      contentfulGraphQLResponse.total = 0;
      contentfulGraphQLResponse.items = [];

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await manuscriptVersionDataProvider.fetch({});

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should exclude manuscripts with null versions', async () => {
      const contentfulGraphQLResponse = getContentfulManuscriptsCollection();

      contentfulGraphQLResponse!.total = 1;
      contentfulGraphQLResponse!.items = [getContentfulManuscript(1, [null])];

      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        manuscriptsCollection: contentfulGraphQLResponse,
      });

      const result = await manuscriptVersionDataProvider.fetch({});

      expect(result.items.length).toEqual(0);
    });

    test('Should return only the latest version for a manuscript', async () => {
      const version1 = getContentfulManuscriptVersion(1, 'Preprint');
      const version2 = getContentfulManuscriptVersion(3, 'Publication');

      const contentfulGraphQLResponse = getContentfulManuscriptsCollection();

      contentfulGraphQLResponse!.total = 1;
      contentfulGraphQLResponse!.items = [
        getContentfulManuscript(1, [version2, version1]),
      ];

      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        manuscriptsCollection: contentfulGraphQLResponse,
      });

      const result = await manuscriptVersionDataProvider.fetch({});

      expect(result.total).toEqual(1);
      expect(result.items[0]?.lifecycle).toEqual('Publication');
    });

    test('Should remove duplicate authors', async () => {
      const authorId = 'first-author-1';
      const version = {
        ...getContentfulManuscriptVersion(1, 'Preprint'),
        firstAuthorsCollection: {
          items: [
            {
              __typename: 'Users',
              sys: {
                id: authorId,
              },
              firstName: 'First',
              lastName: 'Author',
              email: 'author1@gmail.com',
              nickname: 'one',
            },
          ],
        },
        correspondingAuthorCollection: {
          items: [
            {
              __typename: 'Users',
              sys: {
                id: authorId,
              },
              firstName: 'First',
              lastName: 'Author',
              email: 'author1@gmail.com',
              nickname: 'one',
            },
          ],
        },
      } as Version;

      const contentfulGraphQLResponse = getContentfulManuscriptsCollection();

      contentfulGraphQLResponse!.total = 1;
      contentfulGraphQLResponse!.items = [
        getContentfulManuscript(1, [version]),
      ];

      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        manuscriptsCollection: contentfulGraphQLResponse,
      });

      const result = await manuscriptVersionDataProvider.fetch({});

      expect(result.items[0]?.authors?.length).toEqual(1);
      expect(result.items[0]?.authors?.[0]?.id).toEqual(authorId);
    });

    test('Should set hasLinkedResearchOutput to true when researchOutputsCollection has items', async () => {
      const version = {
        ...getContentfulManuscriptVersion(1, 'Preprint'),
        linkedFrom: {
          researchOutputsCollection: {
            total: 1,
          },
          researchOutputVersionsCollection: {
            total: 0,
          },
        },
      } as Version;

      const contentfulGraphQLResponse = getContentfulManuscriptsCollection();

      contentfulGraphQLResponse!.total = 1;
      contentfulGraphQLResponse!.items = [
        getContentfulManuscript(1, [version]),
      ];

      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        manuscriptsCollection: contentfulGraphQLResponse,
      });

      const result = await manuscriptVersionDataProvider.fetch({});

      expect(result.items[0]?.hasLinkedResearchOutput).toBe(true);
    });

    test('Should set hasLinkedResearchOutput to true when researchOutputVersionsCollection has items', async () => {
      const version = {
        ...getContentfulManuscriptVersion(1, 'Preprint'),
        linkedFrom: {
          researchOutputsCollection: {
            total: 0,
          },
          researchOutputVersionsCollection: {
            total: 1,
          },
        },
      } as Version;

      const contentfulGraphQLResponse = getContentfulManuscriptsCollection();

      contentfulGraphQLResponse!.total = 1;
      contentfulGraphQLResponse!.items = [
        getContentfulManuscript(1, [version]),
      ];

      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        manuscriptsCollection: contentfulGraphQLResponse,
      });

      const result = await manuscriptVersionDataProvider.fetch({});

      expect(result.items[0]?.hasLinkedResearchOutput).toBe(true);
    });

    test('Should set hasLinkedResearchOutput to true when both collections have items', async () => {
      const version = {
        ...getContentfulManuscriptVersion(1, 'Preprint'),
        linkedFrom: {
          researchOutputsCollection: {
            total: 1,
          },
          researchOutputVersionsCollection: {
            total: 1,
          },
        },
      } as Version;

      const contentfulGraphQLResponse = getContentfulManuscriptsCollection();

      contentfulGraphQLResponse!.total = 1;
      contentfulGraphQLResponse!.items = [
        getContentfulManuscript(1, [version]),
      ];

      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        manuscriptsCollection: contentfulGraphQLResponse,
      });

      const result = await manuscriptVersionDataProvider.fetch({});

      expect(result.items[0]?.hasLinkedResearchOutput).toBe(true);
    });

    test('Should set hasLinkedResearchOutput to false when both collections are empty', async () => {
      const version = {
        ...getContentfulManuscriptVersion(1, 'Preprint'),
        linkedFrom: {
          researchOutputsCollection: {
            total: 0,
          },
          researchOutputVersionsCollection: {
            total: 0,
          },
        },
      } as Version;

      const contentfulGraphQLResponse = getContentfulManuscriptsCollection();

      contentfulGraphQLResponse!.total = 1;
      contentfulGraphQLResponse!.items = [
        getContentfulManuscript(1, [version]),
      ];

      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        manuscriptsCollection: contentfulGraphQLResponse,
      });

      const result = await manuscriptVersionDataProvider.fetch({});

      expect(result.items[0]?.hasLinkedResearchOutput).toBe(false);
    });

    test('Should set hasLinkedResearchOutput to false when linkedFrom is null', async () => {
      const version = {
        ...getContentfulManuscriptVersion(1, 'Preprint'),
        linkedFrom: null,
      } as Version;

      const contentfulGraphQLResponse = getContentfulManuscriptsCollection();

      contentfulGraphQLResponse!.total = 1;
      contentfulGraphQLResponse!.items = [
        getContentfulManuscript(1, [version]),
      ];

      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        manuscriptsCollection: contentfulGraphQLResponse,
      });

      const result = await manuscriptVersionDataProvider.fetch({});

      expect(result.items[0]?.hasLinkedResearchOutput).toBe(false);
    });

    test('Should set hasLinkedResearchOutput to false when collections are null', async () => {
      const version = {
        ...getContentfulManuscriptVersion(1, 'Preprint'),
        linkedFrom: {
          researchOutputsCollection: null,
          researchOutputVersionsCollection: null,
        },
      } as Version;

      const contentfulGraphQLResponse = getContentfulManuscriptsCollection();

      contentfulGraphQLResponse!.total = 1;
      contentfulGraphQLResponse!.items = [
        getContentfulManuscript(1, [version]),
      ];

      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        manuscriptsCollection: contentfulGraphQLResponse,
      });

      const result = await manuscriptVersionDataProvider.fetch({});

      expect(result.items[0]?.hasLinkedResearchOutput).toBe(false);
    });
  });

  describe('Fetch-by-id', () => {
    test('Should fetch the latest related manuscript version given a manuscript version id', async () => {
      const versionId = 'version-id-1';
      const result =
        await manuscriptVersionDataProviderMockGraphql.fetchById(versionId);

      expect(result).toMatchObject(getManuscriptVersionDataObject());
    });

    test('returns versionFound as false if manuscript version is not found', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValue({
        manuscriptVersions: null,
      });

      const result = await manuscriptVersionDataProvider.fetchById('1');
      expect(result.versionFound).toBe(false);
    });

    test('returns latest manuscript version as undefined if version does not have a related manuscript', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValue({
        manuscriptVersions: {
          linkedFrom: null,
        },
      });

      const result = await manuscriptVersionDataProvider.fetchById('1');
      expect(result).toEqual({
        versionFound: true,
        latestManuscriptVersion: undefined,
      });
    });

    test('returns version id field as undefined if there is no valid manuscript version', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValue({
        manuscriptVersions: {
          linkedFrom: {
            manuscriptsCollection: {
              items: [{ ...getContentfulManuscript(1, []), impact: null }],
            },
          },
        },
      });

      const result = await manuscriptVersionDataProvider.fetchById('1');
      expect(result.latestManuscriptVersion).toEqual(
        expect.objectContaining({ versionId: undefined }),
      );
    });

    test('Should throw an error with a specific error message when the graphql client throws one', async () => {
      const id = 'some-id';
      contentfulGraphqlClientMock.request.mockRejectedValueOnce(
        new GraphQLError('some error message'),
      );

      await expect(manuscriptVersionDataProvider.fetchById(id)).rejects.toThrow(
        'some error message',
      );
    });

    test('Should set hasLinkedResearchOutput to true when researchOutputsCollection has items in fetchById', async () => {
      const versionId = 'version-id-1';
      const version = {
        ...getContentfulManuscriptVersion(1, 'Preprint'),
        linkedFrom: {
          researchOutputsCollection: {
            total: 2,
          },
          researchOutputVersionsCollection: {
            total: 0,
          },
        },
      } as Version;

      contentfulGraphqlClientMock.request.mockResolvedValue({
        manuscriptVersions: {
          linkedFrom: {
            manuscriptsCollection: {
              items: [getContentfulManuscript(1, [version])],
            },
          },
        },
      });

      const result = await manuscriptVersionDataProvider.fetchById(versionId);

      expect(result.latestManuscriptVersion?.hasLinkedResearchOutput).toBe(
        true,
      );
    });

    test('Should set hasLinkedResearchOutput to false when both collections are empty in fetchById', async () => {
      const versionId = 'version-id-1';
      const version = {
        ...getContentfulManuscriptVersion(1, 'Preprint'),
        linkedFrom: {
          researchOutputsCollection: {
            total: 0,
          },
          researchOutputVersionsCollection: {
            total: 0,
          },
        },
      } as Version;

      contentfulGraphqlClientMock.request.mockResolvedValue({
        manuscriptVersions: {
          linkedFrom: {
            manuscriptsCollection: {
              items: [getContentfulManuscript(1, [version])],
            },
          },
        },
      });

      const result = await manuscriptVersionDataProvider.fetchById(versionId);

      expect(result.latestManuscriptVersion?.hasLinkedResearchOutput).toBe(
        false,
      );
    });
  });

  describe('fetchManuscriptVersionIdsByLinkedEntry', () => {
    const environmentMock = getContentfulEnvironmentMock();
    const contentfulRestClientMock: () => Promise<Environment> = () =>
      Promise.resolve(environmentMock);
    const dataProviderWithRestClient =
      new ManuscriptVersionContentfulDataProvider(
        contentfulGraphqlClientMock,
        contentfulRestClientMock,
      );
    test('should throw if REST client is not configured', async () => {
      await expect(
        manuscriptVersionDataProvider.fetchManuscriptVersionIdsByLinkedEntry(
          'entry-1',
          'users',
        ),
      ).rejects.toThrow(
        'REST client not configured for ManuscriptVersionContentfulDataProvider',
      );
    });

    test('should return version IDs from manuscript entry', async () => {
      const entry = getEntry({
        versions: {
          'en-US': [{ sys: { id: 'v1' } }, { sys: { id: 'v2' } }],
        },
      });
      environmentMock.getEntry.mockResolvedValueOnce(entry);

      const result =
        await dataProviderWithRestClient.fetchManuscriptVersionIdsByLinkedEntry(
          'entry-1',
          'manuscripts',
        );

      expect(environmentMock.getEntry).toHaveBeenCalledWith('entry-1', {
        content_type: 'manuscripts',
      });

      expect(result).toEqual(['v1', 'v2']);
    });

    test('should handle case where manuscript entry has no versions', async () => {
      const entry = getEntry({
        versions: {},
      });
      environmentMock.getEntry.mockResolvedValueOnce(entry);

      const result =
        await dataProviderWithRestClient.fetchManuscriptVersionIdsByLinkedEntry(
          'entry-1',
          'manuscripts',
        );

      expect(environmentMock.getEntry).toHaveBeenCalledWith('entry-1', {
        content_type: 'manuscripts',
      });

      expect(result).toEqual([]);
    });

    test('should return version IDs from compliance report entry', async () => {
      const entry = getEntry({
        manuscriptVersion: {
          'en-US': { sys: { id: 'v1' } },
        },
      });
      environmentMock.getEntry.mockResolvedValueOnce(entry);

      const result =
        await dataProviderWithRestClient.fetchManuscriptVersionIdsByLinkedEntry(
          'entry-1',
          'complianceReports',
        );

      expect(environmentMock.getEntry).toHaveBeenCalledWith('entry-1', {
        content_type: 'complianceReports',
      });

      expect(result).toEqual(['v1']);
    });

    test('should handle case where compliance entry has no versions', async () => {
      const entry = getEntry({
        manuscriptVersion: {},
      });
      environmentMock.getEntry.mockResolvedValueOnce(entry);

      const result =
        await dataProviderWithRestClient.fetchManuscriptVersionIdsByLinkedEntry(
          'entry-1',
          'complianceReports',
        );

      expect(environmentMock.getEntry).toHaveBeenCalledWith('entry-1', {
        content_type: 'complianceReports',
      });

      expect(result).toEqual([]);
    });

    test('should merge direct and linked manuscript version IDs', async () => {
      const directVersionEntries = [
        getEntry({}, { id: 'v1' }),
        getEntry({}, { id: 'v2' }),
      ];

      const linkedManuscriptEntries = [
        getEntry(
          {
            versions: {
              'en-US': [{ sys: { id: 'v2' } }, { sys: { id: 'v3' } }],
            },
          },
          { id: 'm1' },
        ),
      ];

      environmentMock.getEntries
        .mockResolvedValueOnce(getEntryCollection(directVersionEntries))
        .mockResolvedValueOnce(getEntryCollection(linkedManuscriptEntries));

      const result =
        await dataProviderWithRestClient.fetchManuscriptVersionIdsByLinkedEntry(
          'entry-1',
          'users',
        );

      expect(environmentMock.getEntries).toHaveBeenCalledTimes(2);

      expect(result.sort()).toEqual(['v1', 'v2', 'v3']);
    });

    test('should handle missing fields safely', async () => {
      const directVersionEntries = [getEntry({}, { id: undefined })];

      const linkedManuscriptEntries = [
        getEntry({}, { id: 'm1' }), // no versions field
      ];

      environmentMock.getEntries
        .mockResolvedValueOnce(getEntryCollection(directVersionEntries))
        .mockResolvedValueOnce(getEntryCollection(linkedManuscriptEntries));

      const result =
        await dataProviderWithRestClient.fetchManuscriptVersionIdsByLinkedEntry(
          'entry-1',
          'users',
        );

      expect(result).toEqual([]);
    });
  });

  describe('fetchComplianceManuscriptVersions', () => {
    test('should fetch manuscript versions by ids using id_in filter', async () => {
      const ids = ['mv1', 'mv2'];

      const response = {
        manuscriptVersionsCollection: {
          total: 2,
          items: [
            getContentfulManuscriptVersion(1),
            getContentfulManuscriptVersion(2),
          ],
        },
      };

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(response);

      const result =
        await manuscriptVersionDataProvider.fetchComplianceManuscriptVersions({
          filter: ids,
        });

      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          where: {
            sys: {
              id_in: ids,
            },
          },
        }),
      );

      expect(result.items.length).toBe(2);
      expect(result.total).toBe(2);
    });

    test('should fetch manuscript versions with pagination when no filter is provided', async () => {
      const response = {
        manuscriptVersionsCollection: {
          total: 5,
          items: [getContentfulManuscriptVersion(1)],
        },
      };

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(response);

      const result =
        await manuscriptVersionDataProvider.fetchComplianceManuscriptVersions({
          take: 10,
          skip: 0,
        });

      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          limit: 10,
          skip: 0,
        }),
      );

      expect(result.total).toBe(5);
    });

    test('should parse manuscript version correctly', async () => {
      const version1 = getContentfulManuscriptVersionFull(1);
      const version2 = getContentfulManuscriptVersionFull(2, {
        sys: { id: 'project-1' },
        projectId: 'P-USER-1',
        grantId: 'G-USER-1',
        title: 'User Project',
      });

      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        manuscriptVersionsCollection: {
          total: 2,
          items: [version1, version2],
        },
      });

      const result =
        await manuscriptVersionDataProvider.fetchComplianceManuscriptVersions({
          filter: [version1.sys.id, version2.sys.id],
        });

      expect(result.items[0]).toHaveProperty('id');
      expect(result.items[0]).toHaveProperty('title');
      expect(result.items[0]).toHaveProperty('mainProject');
      expect(result.items[1]).toHaveProperty('id');
      expect(result.items[1]).toHaveProperty('title');
      expect(result.items[1]).toHaveProperty('mainProject');
    });
    test('should return empty result when no manuscript versions exist', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        manuscriptVersionsCollection: {
          total: 0,
          items: [],
        },
      });

      const result =
        await manuscriptVersionDataProvider.fetchComplianceManuscriptVersions(
          {},
        );

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });
  });
});
