import { getContentfulGraphqlClientMockServer } from '@asap-hub/contentful';

import { GraphQLError } from 'graphql';
import { ManuscriptVersionContentfulDataProvider } from '../../../src/data-providers/contentful/manuscript-version.data-provider';

import {
  getContentfulManuscript,
  getContentfulManuscriptsCollection,
  getContentfulManuscriptVersion,
  getManuscriptVersionDataObject,
  getManuscriptVersionsListResponse,
} from '../../fixtures/manuscript-versions.fixtures';
import { getContentfulGraphqlManuscriptsCollection } from '../../fixtures/manuscript.fixtures';
import { getContentfulGraphql } from '../../fixtures/teams.fixtures';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';

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

      ManuscriptsVersionsCollection: () =>
        getContentfulManuscript().versionsCollection,
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
              items: [getContentfulManuscript(1, [])],
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
  });
});
