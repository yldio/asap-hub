import {
  Asset,
  Entry,
  Environment,
  getContentfulGraphqlClientMockServer,
} from '@asap-hub/contentful';
import { QuickCheck, QuickCheckDetails } from '@asap-hub/model';
import { GraphQLError } from 'graphql';
import { when } from 'jest-when';

import { ManuscriptContentfulDataProvider } from '../../../src/data-providers/contentful/manuscript.data-provider';
import {
  getContentfulGraphqlManuscript,
  getContentfulGraphqlManuscriptVersions,
  getManuscriptCreateDataObject,
  getManuscriptDataObject,
} from '../../fixtures/manuscript.fixtures';
import {
  getContentfulGraphql,
  getUsersTeamsCollection,
} from '../../fixtures/teams.fixtures';
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
      ...getContentfulGraphql(),
      UsersTeamsCollection: () => getUsersTeamsCollection(),
      Manuscripts: () => getContentfulGraphqlManuscript(),
      ManuscriptsVersionsCollection: () =>
        getContentfulGraphqlManuscriptVersions(),
      ManuscriptVersionsTeamsCollection: () =>
        getContentfulGraphqlManuscriptVersions().items[0]?.teamsCollection,
      ManuscriptVersionsLabsCollection: () =>
        getContentfulGraphqlManuscriptVersions().items[0]?.labsCollection,
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

  describe('FetchCountByTeamId', () => {
    it('Should fetch the count of existing manuscripts for a given team', async () => {
      const teamId = 'team-id-1';
      const result =
        await manuscriptDataProviderMockGraphql.fetchCountByTeamId(teamId);
      expect(result).toBe(0);
    });
  });

  describe('Fetch-by-id', () => {
    test('Should fetch the manuscript from Contentful GraphQl', async () => {
      const manuscriptId = 'manuscript-id-1';
      const result =
        await manuscriptDataProviderMockGraphql.fetchById(manuscriptId);

      expect(result).toMatchObject(getManuscriptDataObject());
    });

    test.each`
      field                        | fieldDetails
      ${'acknowledgedGrantNumber'} | ${'acknowledgedGrantNumberDetails'}
      ${'asapAffiliationIncluded'} | ${'asapAffiliationIncludedDetails'}
      ${'manuscriptLicense'}       | ${'manuscriptLicenseDetails'}
      ${'datasetsDeposited'}       | ${'datasetsDepositedDetails'}
      ${'codeDeposited'}           | ${'codeDepositedDetails'}
      ${'protocolsDeposited'}      | ${'protocolsDepositedDetails'}
      ${'labMaterialsRegistered'}  | ${'labMaterialsRegisteredDetails'}
      ${'availabilityStatement'}   | ${'availabilityStatementDetails'}
    `(
      'should return $fieldDetails value if $field is No',
      async ({
        field,
        fieldDetails,
      }: {
        field: QuickCheck;
        fieldDetails: QuickCheckDetails;
      }) => {
        const manuscript = getContentfulGraphqlManuscript();
        manuscript.versionsCollection!.items[0]![field] = 'No';
        manuscript.versionsCollection!.items[0]![fieldDetails] = 'Explanation';

        contentfulGraphqlClientMock.request.mockResolvedValue({
          manuscripts: manuscript,
        });

        const result = await manuscriptDataProvider.fetchById('1');

        expect(result!.versions[0]![fieldDetails]).toEqual('Explanation');
      },
    );

    test.each`
      field                        | fieldDetails
      ${'acknowledgedGrantNumber'} | ${'acknowledgedGrantNumberDetails'}
      ${'asapAffiliationIncluded'} | ${'asapAffiliationIncludedDetails'}
      ${'manuscriptLicense'}       | ${'manuscriptLicenseDetails'}
      ${'datasetsDeposited'}       | ${'datasetsDepositedDetails'}
      ${'codeDeposited'}           | ${'codeDepositedDetails'}
      ${'protocolsDeposited'}      | ${'protocolsDepositedDetails'}
      ${'labMaterialsRegistered'}  | ${'labMaterialsRegisteredDetails'}
      ${'availabilityStatement'}   | ${'availabilityStatementDetails'}
    `(
      'should return $fieldDetails as undefined if $field is Yes',
      async ({
        field,
        fieldDetails,
      }: {
        field: QuickCheck;
        fieldDetails: QuickCheckDetails;
      }) => {
        const manuscript = getContentfulGraphqlManuscript();
        manuscript.versionsCollection!.items[0]![field] = 'Yes';
        manuscript.versionsCollection!.items[0]![fieldDetails] = 'Explanation';

        contentfulGraphqlClientMock.request.mockResolvedValue({
          manuscripts: manuscript,
        });

        const result = await manuscriptDataProvider.fetchById('1');

        expect(result!.versions[0]![fieldDetails]).toBeUndefined();
      },
    );

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
        count: 1,
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

    test('Should default key resource table to undefined if not present', async () => {
      const manuscript = getContentfulGraphqlManuscript();
      manuscript.versionsCollection!.items[0]!.keyResourceTable = undefined;

      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        manuscripts: manuscript,
      });

      const result = await manuscriptDataProvider.fetchById('1');

      expect(result!.versions[0]!.keyResourceTable).toBeUndefined();
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
      const manuscriptCreateDataObject = getManuscriptCreateDataObject();
      manuscriptCreateDataObject.versions[0]!.keyResourceTable = undefined;

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
      const assetMock = {
        sys: { id: manuscriptId },
        publish: jest.fn(),
      } as unknown as Asset;
      when(environmentMock.getAsset)
        .calledWith(manuscriptCreateDataObject.versions[0]!.manuscriptFile.id)
        .mockResolvedValue(assetMock);

      const result = await manuscriptDataProviderMockGraphql.create({
        ...manuscriptCreateDataObject,
        userId: 'user-id-0',
      });

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
            manuscriptFile: {
              'en-US': {
                sys: {
                  type: 'Link',
                  linkType: 'Asset',
                  id: 'file-id',
                },
              },
            },
            keyResourceTable: {
              'en-US': null,
            },
            additionalFiles: {
              'en-US': null,
            },
            description: { 'en-US': 'nice description' },
            labs: { 'en-US': [] },
            firstAuthors: {
              'en-US': [
                {
                  sys: {
                    id: 'author-1',

                    linkType: 'Entry',
                    type: 'Link',
                  },
                },
              ],
            },
            submissionDate: { 'en-US': undefined },
            correspondingAuthor: { 'en-US': [] },
            count: { 'en-US': 1 },
            additionalAuthors: { 'en-US': [] },
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
            createdBy: {
              'en-US': {
                sys: {
                  id: 'user-id-0',
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
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
          eligibilityReasons: {
            'en-US': [],
          },
          count: {
            'en-US': 3,
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
      expect(assetMock.publish).toHaveBeenCalled();
      expect(publish).toHaveBeenCalled();
      expect(result).toEqual(manuscriptId);
    });

    test('can create a manuscript with key resource table and additional files', async () => {
      const manuscriptId = 'manuscript-id-1';
      const manuscriptVersionId = 'manuscript-version-id-1';
      const manuscriptCreateDataObject = getManuscriptCreateDataObject();
      manuscriptCreateDataObject.versions[0]!.additionalFiles = [
        {
          filename: 'manuscript.csv',
          url: 'https://example.com/manuscript.csv',
          id: 'file-table-id',
        },
      ];
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
      const assetMock = {
        sys: { id: manuscriptId },
        publish: jest.fn(),
      } as unknown as Asset;
      when(environmentMock.getAsset)
        .calledWith(manuscriptCreateDataObject.versions[0]!.manuscriptFile.id)
        .mockResolvedValue(assetMock);
      when(environmentMock.getAsset)
        .calledWith(
          manuscriptCreateDataObject.versions[0]!.keyResourceTable!.id,
        )
        .mockResolvedValue(assetMock);

      const result = await manuscriptDataProviderMockGraphql.create({
        ...manuscriptCreateDataObject,
        userId: 'user-id-0',
      });

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
            manuscriptFile: {
              'en-US': {
                sys: {
                  type: 'Link',
                  linkType: 'Asset',
                  id: 'file-id',
                },
              },
            },
            keyResourceTable: {
              'en-US': {
                sys: {
                  type: 'Link',
                  linkType: 'Asset',
                  id: 'file-table-id',
                },
              },
            },
            additionalFiles: {
              'en-US': [
                {
                  sys: {
                    type: 'Link',
                    linkType: 'Asset',
                    id: 'file-table-id',
                  },
                },
              ],
            },
            description: { 'en-US': 'nice description' },
            labs: { 'en-US': [] },
            firstAuthors: {
              'en-US': [
                {
                  sys: {
                    id: 'author-1',

                    linkType: 'Entry',
                    type: 'Link',
                  },
                },
              ],
            },
            submissionDate: { 'en-US': undefined },
            correspondingAuthor: { 'en-US': [] },
            count: { 'en-US': 1 },
            additionalAuthors: { 'en-US': [] },
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
            createdBy: {
              'en-US': {
                sys: {
                  id: 'user-id-0',
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
            },
          },
        },
      );
      expect(environmentMock.createEntry).toHaveBeenCalledWith('manuscripts', {
        fields: {
          title: {
            'en-US': 'Manuscript Title',
          },
          count: {
            'en-US': 3,
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
          eligibilityReasons: {
            'en-US': [],
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
      expect(assetMock.publish).toHaveBeenCalled();
      expect(publish).toHaveBeenCalled();
      expect(result).toEqual(manuscriptId);
    });
  });
});
