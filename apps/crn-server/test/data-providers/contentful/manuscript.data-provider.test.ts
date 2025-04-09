import {
  Asset,
  Entry,
  Environment,
  FetchManuscriptNotificationDetailsQuery,
  FETCH_MANUSCRIPT_BY_ID,
  getContentfulGraphqlClientMockServer,
  pollContentfulGql,
} from '@asap-hub/contentful';
import {
  ManuscriptLifecycle,
  ManuscriptType,
  QuickCheck,
  QuickCheckDetails,
} from '@asap-hub/model';
import { GraphQLError } from 'graphql';
import { when } from 'jest-when';

import {
  getLifecycleCode,
  ManuscriptContentfulDataProvider,
} from '../../../src/data-providers/contentful/manuscript.data-provider';
import logger from '../../../src/utils/logger';
import {
  getContentfulGraphqlManuscript,
  getContentfulGraphqlManuscriptsCollection,
  getContentfulGraphqlManuscriptVersions,
  getManuscriptCreateDataObject,
  getManuscriptDataObject,
  getManuscriptFileResponse,
  getManuscriptGraphqlAssignedUsersCollection,
  getManuscriptsListResponse,
  getManuscriptUpdateAssignedUsersDataObject,
  getManuscriptUpdateStatusDataObject,
  getContentfulGraphqlManuscriptDiscussion,
  getManuscriptDiscussions,
} from '../../fixtures/manuscript.fixtures';
import {
  getContentfulGraphql,
  getContentfulGraphqlManuscripts,
  getUsersTeamsCollection,
} from '../../fixtures/teams.fixtures';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';
import { getContentfulEnvironmentMock } from '../../mocks/contentful-rest-client.mock';

jest.mock('@asap-hub/contentful', () => ({
  ...jest.requireActual('@asap-hub/contentful'),
  patch: jest.fn().mockResolvedValue(undefined),
  pollContentfulGql: jest
    .fn()
    .mockImplementation(async (_version, fetchData, _entity) => {
      await fetchData();
      return Promise.resolve();
    }),
}));
const mockedPostmark = jest.fn();
jest.mock('postmark', () => ({
  ServerClient: jest.fn().mockImplementation(() => ({
    sendEmailWithTemplate: mockedPostmark,
  })),
}));

const mockEnvironmentGetter = jest.fn();
jest.mock('../../../src/config', () => ({
  ...jest.requireActual('../../../src/config'),
  get environment() {
    return mockEnvironmentGetter();
  },
}));

describe('Manuscripts Contentful Data Provider', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

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
      ManuscriptsCollection: () => ({
        ...getContentfulGraphqlManuscripts(),
        total: 2,
      }),
      ManuscriptsDiscussionsCollection: () => ({
        items: [],
      }),
      Manuscripts: () => getContentfulGraphqlManuscript(),
      ManuscriptsAssignedUsersCollection: () =>
        getManuscriptGraphqlAssignedUsersCollection(),
      ManuscriptsVersionsCollection: () =>
        getContentfulGraphqlManuscriptVersions(),
      ManuscriptVersionsTeamsCollection: () =>
        getContentfulGraphqlManuscriptVersions().items[0]?.teamsCollection,
      ManuscriptVersionsLabsCollection: () =>
        getContentfulGraphqlManuscriptVersions().items[0]?.labsCollection,
      ManuscriptVersionsFirstAuthorsCollection: () =>
        getContentfulGraphqlManuscriptVersions().items[0]
          ?.firstAuthorsCollection,
      ManuscriptVersionsCorrespondingAuthorCollection: () =>
        getContentfulGraphqlManuscriptVersions().items[0]
          ?.correspondingAuthorCollection,
      ManuscriptVersionsAdditionalAuthorsCollection: () =>
        getContentfulGraphqlManuscriptVersions().items[0]
          ?.additionalAuthorsCollection,
      Teams: () => ({
        sys: { id: 'team-1' },
        displayName: 'Team A',
        teamId: 'ID01',
        grantId: 'grant',
      }),
    });

  const manuscriptDataProviderMockGraphql =
    new ManuscriptContentfulDataProvider(
      contentfulGraphqlClientMockServer,
      contentfulRestClientMock,
    );

  const getManuscriptVersionCreateGraphQlObject = (
    versionType: ManuscriptType,
    versionLifeCycle: ManuscriptLifecycle,
  ) => {
    return {
      type: {
        'en-US': versionType,
      },
      lifecycle: {
        'en-US': versionLifeCycle,
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
          {
            sys: {
              id: 'team-2',

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
      updatedBy: {
        'en-US': {
          sys: {
            id: 'user-id-0',
            linkType: 'Entry',
            type: 'Link',
          },
        },
      },
      asapAffiliationIncludedDetails: {
        'en-US': null,
      },
      acknowledgedGrantNumberDetails: {
        'en-US': null,
      },
      availabilityStatementDetails: {
        'en-US': null,
      },
      codeDepositedDetails: {
        'en-US': null,
      },
      datasetsDepositedDetails: {
        'en-US': null,
      },
      labMaterialsRegisteredDetails: {
        'en-US': null,
      },
      manuscriptLicenseDetails: {
        'en-US': null,
      },
      protocolsDepositedDetails: {
        'en-US': null,
      },
    };
  };

  beforeEach(() => {
    mockedPostmark.mockResolvedValue({
      ErrorCode: 0,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('Update', () => {
    const patch: jest.MockedFunction<() => Promise<Entry>> = jest.fn();
    const publish: jest.MockedFunction<() => Promise<Entry>> = jest.fn();

    test('can update the manuscript status', async () => {
      jest.setSystemTime(new Date('2025-01-03T10:00:00.000Z'));
      const manuscriptId = 'manuscript-id-1';

      const entry = {
        sys: {
          publishedVersion: 1,
        },
        fields: {
          status: {
            'en-US': 'Addendum Required',
          },
        },
        patch,
        publish,
      } as unknown as Entry;
      environmentMock.getEntry.mockResolvedValue(entry);
      patch.mockResolvedValue(entry);
      publish.mockResolvedValue(entry);

      await manuscriptDataProvider.update(
        manuscriptId,
        {
          ...getManuscriptUpdateStatusDataObject(),
          status: 'Review Compliance Report',
        },
        'user-id-1',
      );

      expect(environmentMock.getEntry).toHaveBeenCalledWith(manuscriptId);
      expect(patch).toHaveBeenCalledWith([
        {
          op: 'replace',
          path: '/fields/status',
          value: { 'en-US': 'Review Compliance Report' },
        },
        {
          op: 'add',
          path: '/fields/previousStatus',
          value: { 'en-US': 'Addendum Required' },
        },
        {
          op: 'add',
          path: '/fields/statusUpdatedBy',
          value: {
            'en-US': {
              sys: { id: 'user-id-1', linkType: 'Entry', type: 'Link' },
            },
          },
        },
        {
          op: 'add',
          path: '/fields/statusUpdatedAt',
          value: {
            'en-US': new Date('2025-01-03T10:00:00.000Z'),
          },
        },
      ]);
      expect(pollContentfulGql).toHaveBeenCalledWith(
        entry.sys.publishedVersion || Infinity,
        expect.any(Function),
        'manuscripts',
      );
      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        FETCH_MANUSCRIPT_BY_ID,
        { id: manuscriptId },
      );
    });

    test('can update assigned users', async () => {
      jest.setSystemTime(new Date('2025-01-03T10:00:00.000Z'));
      const manuscriptId = 'manuscript-id-1';

      const entry = {
        sys: {
          publishedVersion: 1,
        },
        fields: {
          assignedUsers: {
            'en-US': [],
          },
        },
        patch,
        publish,
      } as unknown as Entry;
      environmentMock.getEntry.mockResolvedValue(entry);
      patch.mockResolvedValue(entry);
      publish.mockResolvedValue(entry);

      await manuscriptDataProvider.update(
        manuscriptId,
        getManuscriptUpdateAssignedUsersDataObject(),
        'user-id-1',
      );

      expect(environmentMock.getEntry).toHaveBeenCalledWith(manuscriptId);
      expect(patch).toHaveBeenCalledWith([
        {
          op: 'replace',
          path: '/fields/assignedUsers',
          value: {
            'en-US': [
              {
                sys: {
                  id: 'user-id-1',
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
              {
                sys: {
                  id: 'user-id-2',
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
            ],
          },
        },
      ]);
    });

    test.each`
      status                        | templateAlias
      ${'Review Compliance Report'} | ${'review-compliance-report'}
      ${'Submit Final Publication'} | ${'submit-final-publication'}
      ${'Addendum Required'}        | ${'addendum-required'}
      ${'Compliant'}                | ${'compliant'}
      ${'Closed (other)'}           | ${'closed'}
    `(
      'sends email notification when status is changed to $status and flag is on',
      async ({ status, templateAlias }) => {
        jest.setSystemTime(new Date('2025-01-03T10:00:00.000Z'));
        const manuscriptId = 'manuscript-id-1';

        const manuscript = getContentfulGraphqlManuscript() as NonNullable<
          NonNullable<FetchManuscriptNotificationDetailsQuery>['manuscripts']
        >;
        manuscript.versionsCollection!.items[0]!.firstAuthorsCollection!.items =
          [
            {
              __typename: 'Users',
              email: 'fiona.first@email.com',
            },
          ];

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          manuscripts: manuscript,
        });

        const entry = {
          sys: {
            publishedVersion: 1,
          },
          fields: {
            status: {
              'en-US': `Waiting for Report`,
            },
          },
          patch,
          publish,
        } as unknown as Entry;
        environmentMock.getEntry.mockResolvedValue(entry);
        patch.mockResolvedValue(entry);
        publish.mockResolvedValue(entry);

        await manuscriptDataProvider.update(
          manuscriptId,
          {
            status: status,
            sendNotifications: true,
          },
          'user-id-1',
        );

        expect(mockedPostmark).toHaveBeenCalledWith(
          expect.objectContaining({ TemplateAlias: templateAlias }),
        );
      },
    );

    test('can update the manuscript status', async () => {
      jest.setSystemTime(new Date('2025-01-03T10:00:00.000Z'));
      const manuscriptId = 'manuscript-id-1';

      const manuscript = getContentfulGraphqlManuscript() as NonNullable<
        NonNullable<FetchManuscriptNotificationDetailsQuery>['manuscripts']
      >;
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        manuscripts: manuscript,
      });

      const entry = {
        sys: {
          publishedVersion: 1,
        },
        fields: {
          status: {
            'en-US': `Waiting for Report`,
          },
        },
        patch,
        publish,
      } as unknown as Entry;
      environmentMock.getEntry.mockResolvedValue(entry);
      patch.mockResolvedValue(entry);
      publish.mockResolvedValue(entry);

      await manuscriptDataProvider.update(
        manuscriptId,
        {
          status: 'Waiting for Report',
          sendNotifications: true,
        },
        'user-id-1',
      );

      expect(mockedPostmark).not.toHaveBeenCalled();
    });
    test('sends email notification when notification flag is off but there is a notification list', async () => {
      jest.setSystemTime(new Date('2025-01-03T10:00:00.000Z'));
      const manuscriptId = 'manuscript-id-1';

      const manuscript = getContentfulGraphqlManuscript() as NonNullable<
        NonNullable<FetchManuscriptNotificationDetailsQuery>['manuscripts']
      >;
      manuscript.versionsCollection!.items[0]!.firstAuthorsCollection!.items = [
        {
          __typename: 'Users',
          email: 'fiona.first@email.com',
        },
      ];

      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        manuscripts: manuscript,
      });

      const entry = {
        sys: {
          publishedVersion: 1,
        },
        fields: {
          status: {
            'en-US': `Waiting for Report`,
          },
        },
        patch,
        publish,
      } as unknown as Entry;
      environmentMock.getEntry.mockResolvedValue(entry);
      patch.mockResolvedValue(entry);
      publish.mockResolvedValue(entry);

      await manuscriptDataProvider.update(
        manuscriptId,
        {
          status: 'Review Compliance Report',
          sendNotifications: false,
          notificationList: 'fiona.first@email.com',
        },
        'user-id-1',
      );

      expect(mockedPostmark).toHaveBeenCalledWith(
        expect.objectContaining({ TemplateAlias: 'review-compliance-report' }),
      );
    });

    test('can update the manuscript version content, title and teams', async () => {
      const manuscriptId = 'manuscript-id-1';
      const versionId = 'version-id-1';
      const manuscriptEntry = {
        sys: {
          publishedVersion: 1,
        },
        fields: {
          versions: {
            'en-US': [{ sys: { id: versionId } }],
          },
        },
        patch,
        publish,
      } as unknown as Entry;

      const entry = {
        sys: {
          publishedVersion: 1,
        },
        fields: {},
        patch,
        publish,
      } as unknown as Entry;

      const assetMock = {
        sys: { id: manuscriptId },
        publish: jest.fn(),
      } as unknown as Asset;

      when(environmentMock.getEntry)
        .calledWith(manuscriptId)
        .mockResolvedValue(manuscriptEntry);

      when(environmentMock.getEntry)
        .calledWith(versionId)
        .mockResolvedValue(entry);

      environmentMock.getAsset.mockResolvedValue(assetMock);

      patch.mockResolvedValue(entry);
      publish.mockResolvedValue(entry);

      await manuscriptDataProvider.update(
        manuscriptId,
        {
          title: 'New Title',
          versions: [
            {
              lifecycle: 'Preprint',
              type: 'Original Research',
              teams: ['team-1', 'team-2'],
              manuscriptFile: getManuscriptFileResponse(),
              description: 'edited description',
              firstAuthors: ['author-1'],
              correspondingAuthor: ['author-2'],
              additionalAuthors: ['external-1'],
              keyResourceTable: {
                filename: 'manuscript.csv',
                url: 'https://example.com/manuscript.csv',
                id: 'file-table-id',
              },
              additionalFiles: [
                {
                  filename: 'manuscript.csv',
                  url: 'https://example.com/manuscript.csv',
                  id: 'file-additional-id',
                },
              ],
            },
          ],
        },
        'user-id-1',
      );

      expect(environmentMock.getEntry).toHaveBeenCalledWith(manuscriptId);
      expect(patch).toHaveBeenCalledTimes(2);
      expect(patch).toHaveBeenNthCalledWith(1, [
        {
          op: 'add',
          path: '/fields/title',
          value: { 'en-US': 'New Title' },
        },
        {
          op: 'add',
          path: '/fields/teams',
          value: {
            'en-US': [
              {
                sys: {
                  id: 'team-1',
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
              {
                sys: {
                  id: 'team-2',
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
            ],
          },
        },
      ]);

      expect(patch).toHaveBeenNthCalledWith(
        2,
        expect.arrayContaining([
          {
            op: 'add',
            path: '/fields/lifecycle',
            value: {
              'en-US': 'Preprint',
            },
          },
          {
            op: 'add',
            path: '/fields/type',
            value: {
              'en-US': 'Original Research',
            },
          },
          {
            op: 'add',
            path: '/fields/teams',
            value: {
              'en-US': [
                {
                  sys: {
                    id: 'team-1',
                    linkType: 'Entry',
                    type: 'Link',
                  },
                },
                {
                  sys: {
                    id: 'team-2',
                    linkType: 'Entry',
                    type: 'Link',
                  },
                },
              ],
            },
          },
          {
            op: 'add',
            path: '/fields/manuscriptFile',
            value: {
              'en-US': {
                sys: {
                  id: 'file-id',
                  linkType: 'Asset',
                  type: 'Link',
                },
              },
            },
          },
          {
            op: 'add',
            path: '/fields/keyResourceTable',
            value: {
              'en-US': {
                sys: {
                  id: 'file-table-id',
                  linkType: 'Asset',
                  type: 'Link',
                },
              },
            },
          },
          {
            op: 'add',
            path: '/fields/additionalFiles',
            value: {
              'en-US': [
                {
                  sys: {
                    id: 'file-additional-id',
                    linkType: 'Asset',
                    type: 'Link',
                  },
                },
              ],
            },
          },
          {
            op: 'add',
            path: '/fields/description',
            value: {
              'en-US': 'edited description',
            },
          },
          {
            op: 'add',
            path: '/fields/firstAuthors',
            value: {
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
          },
          {
            op: 'add',
            path: '/fields/correspondingAuthor',
            value: {
              'en-US': [
                {
                  sys: {
                    id: 'author-2',
                    linkType: 'Entry',
                    type: 'Link',
                  },
                },
              ],
            },
          },
          {
            op: 'add',
            path: '/fields/additionalAuthors',
            value: {
              'en-US': [
                {
                  sys: {
                    id: 'external-1',
                    linkType: 'Entry',
                    type: 'Link',
                  },
                },
              ],
            },
          },

          {
            op: 'add',
            path: '/fields/updatedBy',
            value: {
              'en-US': {
                sys: {
                  id: 'user-id-1',
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
            },
          },
        ]),
      );
    });

    test('fetches the manuscript last version so it can be updated', async () => {
      const manuscriptId = 'manuscript-id-1';
      const oldVersionId = 'old-version-id';
      const newVersionId = 'new-version-id';
      const manuscriptEntry = {
        sys: {
          publishedVersion: 1,
        },
        fields: {
          versions: {
            'en-US': [
              { sys: { id: oldVersionId } },
              { sys: { id: newVersionId } },
            ],
          },
        },
        patch,
        publish,
      } as unknown as Entry;

      const entry = {
        sys: {
          publishedVersion: 1,
        },
        fields: {},
        patch,
        publish,
      } as unknown as Entry;

      const assetMock = {
        sys: { id: manuscriptId },
        publish: jest.fn(),
      } as unknown as Asset;

      when(environmentMock.getEntry)
        .calledWith(manuscriptId)
        .mockResolvedValue(manuscriptEntry);

      when(environmentMock.getEntry)
        .calledWith(newVersionId)
        .mockResolvedValue(entry);

      environmentMock.getAsset.mockResolvedValue(assetMock);

      patch.mockResolvedValue(entry);
      publish.mockResolvedValue(entry);

      await manuscriptDataProvider.update(
        manuscriptId,
        {
          title: 'New Title',
          versions: [
            {
              lifecycle: 'Preprint',
              type: 'Original Research',
              teams: ['team-1', 'team-2'],
              manuscriptFile: getManuscriptFileResponse(),
              description: 'edited description',
              firstAuthors: ['author-1'],
              correspondingAuthor: ['author-2'],
              additionalAuthors: ['external-1'],
              keyResourceTable: {
                filename: 'manuscript.csv',
                url: 'https://example.com/manuscript.csv',
                id: 'file-table-id',
              },
              additionalFiles: [
                {
                  filename: 'manuscript.csv',
                  url: 'https://example.com/manuscript.csv',
                  id: 'file-additional-id',
                },
              ],
            },
          ],
        },
        'user-id-1',
      );

      expect(environmentMock.getEntry).toHaveBeenCalledWith(manuscriptId);
      expect(environmentMock.getEntry).toHaveBeenCalledWith(newVersionId);
      expect(environmentMock.getEntry).not.toHaveBeenCalledWith(oldVersionId);
    });

    test('can update the manuscript when keyResourceTable and additionalFiles are not passed', async () => {
      const manuscriptId = 'manuscript-id-1';
      const versionId = 'version-id-1';
      const manuscriptEntry = {
        sys: {
          publishedVersion: 1,
        },
        fields: {
          versions: {
            'en-US': [{ sys: { id: versionId } }],
          },
        },
        patch,
        publish,
      } as unknown as Entry;

      const entry = {
        sys: {
          publishedVersion: 1,
        },
        fields: {},
        patch,
        publish,
      } as unknown as Entry;

      const assetMock = {
        sys: { id: manuscriptId },
        publish: jest.fn(),
      } as unknown as Asset;

      when(environmentMock.getEntry)
        .calledWith(manuscriptId)
        .mockResolvedValue(manuscriptEntry);

      when(environmentMock.getEntry)
        .calledWith(versionId)
        .mockResolvedValue(entry);

      environmentMock.getAsset.mockResolvedValue(assetMock);

      patch.mockResolvedValue(entry);
      publish.mockResolvedValue(entry);

      await manuscriptDataProvider.update(
        manuscriptId,
        {
          title: 'New Title',
          versions: [
            {
              lifecycle: 'Preprint',
              type: 'Original Research',
              teams: ['team-1'],
              manuscriptFile: getManuscriptFileResponse(),
              description: 'edited description',
              firstAuthors: ['author-1'],
              correspondingAuthor: ['author-2'],
              additionalAuthors: ['external-1'],
            },
          ],
        },
        'user-id-1',
      );

      expect(environmentMock.getEntry).toHaveBeenCalledWith(manuscriptId);
      expect(patch).toHaveBeenCalledTimes(2);
      expect(patch).toHaveBeenNthCalledWith(1, [
        {
          op: 'add',
          path: '/fields/title',
          value: { 'en-US': 'New Title' },
        },
        {
          op: 'add',
          path: '/fields/teams',
          value: {
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
        },
      ]);

      expect(patch).toHaveBeenNthCalledWith(
        2,
        expect.arrayContaining([
          {
            op: 'add',
            path: '/fields/keyResourceTable',
            value: { 'en-US': null },
          },
          {
            op: 'add',
            path: '/fields/additionalFiles',
            value: { 'en-US': null },
          },
        ]),
      );
    });
  });

  describe('Fetch', () => {
    test('Should fetch the manuscripts from Contentful graphql', async () => {
      const result = await manuscriptDataProviderMockGraphql.fetch({});

      const expectedResult = getManuscriptsListResponse();
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

      const result = await manuscriptDataProvider.fetch({});

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });
  });

  describe('FetchCountByTeamId', () => {
    it('Should return 0 when team does not exist', async () => {
      const teamId = 'team-id-2';
      const result =
        await manuscriptDataProviderMockGraphql.fetchCountByTeamId(teamId);
      expect(result).toBe(0);
    });

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
        manuscript.versionsCollection!.items[0]![fieldDetails] = 'text';

        contentfulGraphqlClientMock.request.mockResolvedValue({
          manuscripts: manuscript,
        });

        const result = await manuscriptDataProvider.fetchById('1');

        expect(result!.versions[0]![fieldDetails]).toEqual('text');
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
        manuscript.versionsCollection!.items[0]![fieldDetails] = 'text';

        contentfulGraphqlClientMock.request.mockResolvedValue({
          manuscripts: manuscript,
        });

        const result = await manuscriptDataProvider.fetchById('1');

        expect(result!.versions[0]![fieldDetails]).toBeUndefined();
      },
    );

    test('returns authors', async () => {
      const manuscript = getContentfulGraphqlManuscript();
      manuscript.versionsCollection!.items[0]!.firstAuthorsCollection!.items = [
        {
          __typename: 'Users',
          sys: {
            id: 'user-id-1',
          },
          avatar: null,
          firstName: 'Fiona',
          lastName: 'First',
          nickname: null,
          email: 'fiona.first@email.com',
        },
        {
          __typename: 'ExternalAuthors',
          sys: {
            id: 'external-id-1',
          },
          name: 'First External',
          email: 'first.external@email.com',
        },
      ];

      manuscript.versionsCollection!.items[0]!.correspondingAuthorCollection!.items =
        [
          {
            __typename: 'Users',
            sys: {
              id: 'corresponding-id-1',
            },
            avatar: null,
            firstName: 'Connor',
            lastName: 'Corresponding',
            nickname: null,
            email: 'connor.corresponding@email.com',
          },
        ];

      manuscript.versionsCollection!.items[0]!.additionalAuthorsCollection!.items =
        [
          {
            __typename: 'Users',
            sys: {
              id: 'additional-id-1',
            },
            avatar: null,
            firstName: 'Adele',
            lastName: 'Additional',
            nickname: null,
            email: 'adele.additional@email.com',
          },
          {
            __typename: 'ExternalAuthors',
            sys: {
              id: 'external-id-1',
            },
            name: 'Second External',
            email: 'second.external@email.com',
          },
        ];

      contentfulGraphqlClientMock.request.mockResolvedValue({
        manuscripts: manuscript,
      });

      const result = await manuscriptDataProvider.fetchById('1');
      expect(result!.versions[0]!.firstAuthors).toEqual([
        {
          avatarUrl: undefined,
          displayName: 'Fiona First',
          email: 'fiona.first@email.com',
          firstName: 'Fiona',
          id: 'user-id-1',
          lastName: 'First',
        },
        {
          displayName: 'First External',
          email: 'first.external@email.com',
          id: 'external-id-1',
        },
      ]);

      expect(result!.versions[0]!.correspondingAuthor).toEqual([
        {
          avatarUrl: undefined,
          displayName: 'Connor Corresponding',
          email: 'connor.corresponding@email.com',
          firstName: 'Connor',
          id: 'corresponding-id-1',
          lastName: 'Corresponding',
        },
      ]);

      expect(result!.versions[0]!.additionalAuthors).toEqual([
        {
          avatarUrl: undefined,
          displayName: 'Adele Additional',
          email: 'adele.additional@email.com',
          firstName: 'Adele',
          id: 'additional-id-1',
          lastName: 'Additional',
        },
        {
          displayName: 'Second External',
          email: 'second.external@email.com',
          id: 'external-id-1',
        },
      ]);
    });

    test('should default null values to empty strings and arrays', async () => {
      const manuscript = getContentfulGraphqlManuscript();
      manuscript.title = null;
      manuscript.teamsCollection = null;
      manuscript.versionsCollection = null;
      manuscript.status = null;
      manuscript.assignedUsersCollection = null;
      manuscript.discussionsCollection = null;
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
        assignedUsers: [],
        discussions: [],
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

    describe('Discussions', () => {
      test('should return an empty array if no discussions are present', async () => {
        const manuscript = getContentfulGraphqlManuscript();
        manuscript.discussionsCollection = null;

        contentfulGraphqlClientMock.request.mockResolvedValue({
          manuscripts: manuscript,
        });

        const result = await manuscriptDataProvider.fetchById('1');
        expect(result!.discussions).toEqual([]);
      });

      test('should return an empty array if no user has no teams', async () => {
        const manuscript = getContentfulGraphqlManuscript();
        manuscript.discussionsCollection = {
          items: [
            {
              ...getContentfulGraphqlManuscriptDiscussion(),
              message: {
                ...getContentfulGraphqlManuscriptDiscussion().message!,
                createdBy: {
                  ...getContentfulGraphqlManuscriptDiscussion().message!
                    .createdBy!,
                  teamsCollection: null,
                },
              },
            },
          ],
          total: 1,
        };

        contentfulGraphqlClientMock.request.mockResolvedValue({
          manuscripts: manuscript,
        });

        const result = await manuscriptDataProvider.fetchById('1');
        expect(result!.discussions[0]?.createdBy.teams).toEqual([]);
      });

      test('should return the discussions if they are present', async () => {
        const manuscript = getContentfulGraphqlManuscript();
        manuscript.discussionsCollection = {
          items: [getContentfulGraphqlManuscriptDiscussion()],
          total: 1,
        };

        contentfulGraphqlClientMock.request.mockResolvedValue({
          manuscripts: manuscript,
        });

        const result = await manuscriptDataProvider.fetchById('1');
        expect(result!.discussions).toEqual([getManuscriptDiscussions()]);
      });

      test('should sort the discussions by last updated at descending', async () => {
        const manuscript = getContentfulGraphqlManuscript();

        const discussion1 = getContentfulGraphqlManuscriptDiscussion();
        discussion1.sys.id = 'discussion-id-1';
        discussion1.message!.sys.publishedAt = '2025-04-01T10:00:00.000Z';
        discussion1.repliesCollection!.items[0]!.sys.publishedAt =
          '2025-04-01T15:00:00.000Z';

        const discussion2 = getContentfulGraphqlManuscriptDiscussion();
        discussion2.sys.id = 'discussion-id-2';
        discussion2.message!.sys.publishedAt = '2025-04-04T12:00:00.000Z';
        discussion2.repliesCollection!.items[0]!.sys.publishedAt =
          '2025-04-04T15:00:00.000Z';

        const discussion3 = getContentfulGraphqlManuscriptDiscussion();
        discussion3.sys.id = 'discussion-id-3';
        discussion3.message!.sys.publishedAt = '2025-04-03T15:00:00.000Z';
        discussion3.repliesCollection = null;

        manuscript.discussionsCollection = {
          items: [discussion1, discussion2, discussion3],
          total: 2,
        };

        contentfulGraphqlClientMock.request.mockResolvedValue({
          manuscripts: manuscript,
        });

        const result = await manuscriptDataProvider.fetchById('1');
        expect(result!.discussions).toEqual([
          expect.objectContaining({
            id: 'discussion-id-2',
          }),
          expect.objectContaining({
            id: 'discussion-id-3',
          }),
          expect.objectContaining({
            id: 'discussion-id-1',
          }),
        ]);
      });
    });
  });

  describe('Create', () => {
    const manuscriptId = 'manuscript-id-1';
    const manuscriptVersionId = 'manuscript-version-id-1';

    const manuscriptCreateGraphQlObject = {
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
          {
            sys: {
              id: 'team-2',
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
      status: {
        'en-US': 'Waiting for Report',
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
    };

    test('should throw if no versions are provided', async () => {
      const manuscriptCreateDataObject = getManuscriptCreateDataObject();
      manuscriptCreateDataObject.versions = [];
      await expect(
        manuscriptDataProvider.create(manuscriptCreateDataObject),
      ).rejects.toThrow('No versions provided');
    });

    test('can create a manuscript', async () => {
      const manuscriptCreateDataObject = getManuscriptCreateDataObject();
      manuscriptCreateDataObject.versions[0]!.keyResourceTable = undefined;

      const manuscriptType = manuscriptCreateDataObject.versions[0]!
        .type as ManuscriptType;
      const manuscriptLifecycle = manuscriptCreateDataObject.versions[0]!
        .lifecycle as ManuscriptLifecycle;

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
            ...getManuscriptVersionCreateGraphQlObject(
              manuscriptType,
              manuscriptLifecycle,
            ),
          },
        },
      );
      expect(environmentMock.createEntry).toHaveBeenCalledWith('manuscripts', {
        fields: {
          ...manuscriptCreateGraphQlObject,
        },
      });
      expect(assetMock.publish).toHaveBeenCalled();
      expect(publish).toHaveBeenCalled();
      expect(result).toEqual(manuscriptId);
    });

    test('can create a manuscript with key resource table and additional files', async () => {
      const manuscriptCreateDataObject = getManuscriptCreateDataObject();
      manuscriptCreateDataObject.versions[0]!.additionalFiles = [
        {
          filename: 'manuscript.csv',
          url: 'https://example.com/manuscript.csv',
          id: 'file-table-id',
        },
      ];

      const manuscriptType = manuscriptCreateDataObject.versions[0]!
        .type as ManuscriptType;
      const manuscriptLifecycle = manuscriptCreateDataObject.versions[0]!
        .lifecycle as ManuscriptLifecycle;

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
            ...getManuscriptVersionCreateGraphQlObject(
              manuscriptType,
              manuscriptLifecycle,
            ),
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
          },
        },
      );
      expect(environmentMock.createEntry).toHaveBeenCalledWith('manuscripts', {
        fields: {
          ...manuscriptCreateGraphQlObject,
        },
      });
      expect(assetMock.publish).toHaveBeenCalled();
      expect(publish).toHaveBeenCalled();
      expect(result).toEqual(manuscriptId);
    });

    describe('quick check details', () => {
      it.each`
        quickCheckDetail
        ${`acknowledgedGrantNumberDetails`}
        ${`asapAffiliationIncludedDetails`}
        ${`availabilityStatementDetails`}
        ${`codeDepositedDetails`}
        ${`datasetsDepositedDetails`}
        ${`labMaterialsRegisteredDetails`}
        ${`manuscriptLicenseDetails`}
        ${`protocolsDepositedDetails`}
      `(
        `Should create the manuscript when $quickCheckDetail is present`,
        async ({
          quickCheckDetail,
        }: {
          quickCheckDetail: QuickCheckDetails;
        }) => {
          const manuscriptCreateDataObject = getManuscriptCreateDataObject();
          manuscriptCreateDataObject.versions[0]!.keyResourceTable = undefined;
          manuscriptCreateDataObject.versions[0]![quickCheckDetail] =
            'Explanation';

          const manuscriptType = manuscriptCreateDataObject.versions[0]!
            .type as ManuscriptType;
          const manuscriptLifecycle = manuscriptCreateDataObject.versions[0]!
            .lifecycle as ManuscriptLifecycle;

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
            .calledWith(
              manuscriptCreateDataObject.versions[0]!.manuscriptFile.id,
            )
            .mockResolvedValue(assetMock);

          const result = await manuscriptDataProviderMockGraphql.create({
            ...manuscriptCreateDataObject,
            userId: 'user-id-0',
          });

          expect(environmentMock.createEntry).toHaveBeenCalledWith(
            'manuscriptVersions',
            {
              fields: {
                ...getManuscriptVersionCreateGraphQlObject(
                  manuscriptType,
                  manuscriptLifecycle,
                ),
                [quickCheckDetail]: {
                  'en-US': 'Explanation',
                },
              },
            },
          );
          expect(result).toEqual(manuscriptId);
        },
      );
    });
  });

  describe('Create-Version', () => {
    const manuscriptId = 'manuscript-id-1';
    const manuscriptVersionId = 'manuscript-version-id-1';

    test('should throw if no versions are provided', async () => {
      const manuscriptCreateDataObject = getManuscriptCreateDataObject();
      manuscriptCreateDataObject.versions = [];
      await expect(
        manuscriptDataProvider.createVersion(
          manuscriptId,
          manuscriptCreateDataObject,
        ),
      ).rejects.toThrow('No versions provided');
    });

    test('can create a new manuscript version', async () => {
      const patch: jest.MockedFunction<() => Promise<Entry>> = jest.fn();
      const publish: jest.MockedFunction<() => Promise<Entry>> = jest.fn();

      const manuscriptCreateDataObject = getManuscriptCreateDataObject();
      manuscriptCreateDataObject.versions[0]!.keyResourceTable = undefined;

      const manuscriptType = manuscriptCreateDataObject.versions[0]!
        .type as ManuscriptType;
      const manuscriptLifecycle = manuscriptCreateDataObject.versions[0]!
        .lifecycle as ManuscriptLifecycle;

      const manuscriptEntry = {
        sys: {
          publishedVersion: 1,
        },
        fields: {
          versions: {
            'en-US': [
              {
                sys: {
                  id: 'previous-version',
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
            ],
          },
        },
        patch,
        publish,
      } as unknown as Entry;

      environmentMock.getEntry.mockResolvedValue(manuscriptEntry);
      patch.mockResolvedValue(manuscriptEntry);
      publish.mockResolvedValue(manuscriptEntry);

      when(environmentMock.createEntry)
        .calledWith('manuscriptVersions', expect.anything())
        .mockResolvedValue({
          sys: { id: manuscriptVersionId },
          publish,
        } as unknown as Entry);

      const assetMock = {
        sys: { id: manuscriptId },
        publish: jest.fn(),
      } as unknown as Asset;
      when(environmentMock.getAsset)
        .calledWith(manuscriptCreateDataObject.versions[0]!.manuscriptFile.id)
        .mockResolvedValue(assetMock);

      await manuscriptDataProviderMockGraphql.createVersion(manuscriptId, {
        ...manuscriptCreateDataObject,
        userId: 'user-id-0',
      });

      expect(environmentMock.createEntry).toHaveBeenNthCalledWith(
        1,
        'manuscriptVersions',
        {
          fields: {
            ...getManuscriptVersionCreateGraphQlObject(
              manuscriptType,
              manuscriptLifecycle,
            ),
            count: { 'en-US': 2 },
          },
        },
      );

      expect(assetMock.publish).toHaveBeenCalled();
      expect(publish).toHaveBeenCalled();
      expect(patch).toHaveBeenCalledWith([
        {
          op: 'replace',
          path: '/fields/versions',
          value: {
            'en-US': [
              {
                sys: {
                  id: 'previous-version',
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
              {
                sys: {
                  id: 'manuscript-version-id-1',
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
            ],
          },
        },
        {
          op: 'add',
          path: '/fields/title',
          value: { 'en-US': 'Manuscript Title' },
        },
        {
          op: 'add',
          path: '/fields/teams',
          value: {
            'en-US': [
              {
                sys: {
                  id: 'team-1',
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
              {
                sys: {
                  id: 'team-2',
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
            ],
          },
        },
        {
          op: 'add',
          path: '/fields/status',
          value: {
            'en-US': 'Manuscript Resubmitted',
          },
        },
      ]);
    });
  });

  describe('sendEmailNotification', () => {
    const assignedUsers = {
      items: [
        {
          firstName: 'John',
          lastName: 'Doe',
        },
        {
          firstName: 'Jane',
          lastName: 'Doe',
        },
      ],
    };
    const manuscript = getContentfulGraphqlManuscript() as NonNullable<
      NonNullable<FetchManuscriptNotificationDetailsQuery>['manuscripts']
    >;
    manuscript.assignedUsersCollection = assignedUsers;
    manuscript.versionsCollection!.items[0]!.firstAuthorsCollection!.items = [
      {
        __typename: 'Users',
        email: 'fiona.first@email.com',
      },
    ];

    manuscript.versionsCollection!.items[0]!.correspondingAuthorCollection!.items =
      [
        {
          __typename: 'Users',
          email: 'connor.corresponding@email.com',
        },
      ];

    manuscript.versionsCollection!.items[0]!.additionalAuthorsCollection!.items =
      [
        {
          __typename: 'ExternalAuthors',
          email: 'second.external@email.com',
        },
      ];

    test('Should not send email notification if flag not enabled and no notification list', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValue({
        manuscripts: manuscript,
      });

      await manuscriptDataProvider.sendEmailNotification(
        'manuscript_submitted',
        manuscript.sys.id,
        false,
        '',
      );

      expect(mockedPostmark).not.toHaveBeenCalled();
    });

    test('Should not send email notification if manuscript not returned', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValue({
        manuscripts: null,
      });

      await manuscriptDataProvider.sendEmailNotification(
        'manuscript_submitted',
        manuscript.sys.id,
        true,
        '',
      );

      expect(mockedPostmark).not.toHaveBeenCalled();
    });

    test('filters recipients emails when flag is off and notification list is provided', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValue({
        manuscripts: manuscript,
      });

      await manuscriptDataProvider.sendEmailNotification(
        'manuscript_submitted',
        manuscript.sys.id,
        false,
        'second.external@email.com',
      );

      expect(mockedPostmark).toHaveBeenCalledWith(
        expect.objectContaining({ To: 'second.external@email.com' }),
      );
    });

    test('can send open science team emails to specified emails in dev environment', async () => {
      mockEnvironmentGetter.mockReturnValue('dev');
      contentfulGraphqlClientMock.request.mockResolvedValue({
        manuscripts: manuscript,
      });

      await manuscriptDataProvider.sendEmailNotification(
        'manuscript_submitted',
        manuscript.sys.id,
        false,
        'dsnyder@parkinsonsroadmap.org',
      );

      expect(mockedPostmark).toHaveBeenCalledWith(
        expect.objectContaining({ To: 'dsnyder@parkinsonsroadmap.org' }),
      );
    });

    test('Should log when email fails to send', async () => {
      const loggerErrorSpy = jest.spyOn(logger, 'error');
      contentfulGraphqlClientMock.request.mockResolvedValue({
        manuscripts: manuscript,
      });
      mockedPostmark
        .mockResolvedValueOnce({
          ErrorCode: 405,
          Message: 'Not allowed to send',
        })
        .mockResolvedValueOnce({
          ErrorCode: 406,
          Message: 'Inactive recipient',
        });

      await manuscriptDataProvider.sendEmailNotification(
        'manuscript_submitted',
        manuscript.sys.id,
        false,
        'second.external@email.com,openscience@parkinsonsroadmap.org',
      );

      expect(loggerErrorSpy).toHaveBeenNthCalledWith(
        1,
        `Error while sending compliance email notification: Not allowed to send`,
      );
      expect(loggerErrorSpy).toHaveBeenNthCalledWith(
        2,
        `Error while sending compliance email notification: Inactive recipient`,
      );
    });

    test('sends email notification with contributing authors as recipients', async () => {
      const recipients =
        'fiona.first@email.com,second.external@email.com,connor.corresponding@email.com';

      contentfulGraphqlClientMock.request.mockResolvedValue({
        manuscripts: manuscript,
      });

      await manuscriptDataProvider.sendEmailNotification(
        'manuscript_submitted',
        manuscript.sys.id,
        true,
        '',
      );

      expect(mockedPostmark).toHaveBeenCalledWith(
        expect.objectContaining({ To: recipients }),
      );
    });

    test('sends email notification with active Project Managers and Lead PIs of contributing teams as recipients', async () => {
      const manuscript = getContentfulGraphqlManuscript() as NonNullable<
        NonNullable<FetchManuscriptNotificationDetailsQuery>['manuscripts']
      >;

      manuscript.versionsCollection!.items[0]!.teamsCollection!.items = [
        {
          sys: {
            id: 'team-1',
          },
          linkedFrom: {
            teamMembershipCollection: {
              items: [
                {
                  role: 'Project Manager',
                  inactiveSinceDate: '2022-01-03T10:00:00.000Z',
                  linkedFrom: {
                    usersCollection: {
                      items: [
                        {
                          alumniSinceDate: null,
                          email: 'inactive.membership@example.com',
                        },
                      ],
                    },
                  },
                },
                {
                  role: 'Project Manager',
                  inactiveSinceDate: null,
                  linkedFrom: {
                    usersCollection: {
                      items: [
                        {
                          alumniSinceDate: '2022-01-03T10:00:00.000Z',
                          email: 'inactive.user@example.com',
                        },
                      ],
                    },
                  },
                },
                {
                  role: 'Project Manager',
                  inactiveSinceDate: null,
                  linkedFrom: {
                    usersCollection: {
                      items: [
                        {
                          alumniSinceDate: null,
                          email: 'active.pm@example.com',
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
        {
          sys: {
            id: 'team-2',
          },
          linkedFrom: {
            teamMembershipCollection: {
              items: [
                {
                  role: 'Trainee',
                  inactiveSinceDate: null,
                  linkedFrom: {
                    usersCollection: {
                      items: [
                        {
                          alumniSinceDate: null,
                          email: 'trainee@example.com',
                        },
                      ],
                    },
                  },
                },
                {
                  role: 'Lead PI (Core Leadership)',
                  inactiveSinceDate: null,
                  linkedFrom: {
                    usersCollection: {
                      items: [
                        {
                          alumniSinceDate: null,
                          email: 'lead.pi@example.com',
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
      ];
      manuscript.versionsCollection!.items[0]!.firstAuthorsCollection =
        undefined;
      manuscript.versionsCollection!.items[0]!.additionalAuthorsCollection =
        undefined;
      manuscript.versionsCollection!.items[0]!.correspondingAuthorCollection =
        undefined;

      const recipients = 'active.pm@example.com,lead.pi@example.com';

      contentfulGraphqlClientMock.request.mockResolvedValue({
        manuscripts: manuscript,
      });

      await manuscriptDataProvider.sendEmailNotification(
        'manuscript_submitted',
        manuscript.sys.id,
        true,
        '',
      );
      expect(mockedPostmark).toHaveBeenCalledWith(
        expect.objectContaining({ To: recipients }),
      );
    });

    test('sends email notification with active PIs of contributing labs as recipients', async () => {
      const manuscript = getContentfulGraphqlManuscript() as NonNullable<
        NonNullable<FetchManuscriptNotificationDetailsQuery>['manuscripts']
      >;

      manuscript.versionsCollection!.items[0]!.labsCollection!.items = [
        {
          labPi: {
            alumniSinceDate: '2022-01-03T10:00:00.000Z',
            email: 'inactive.pi@example.com',
          },
        },
        {
          labPi: {
            alumniSinceDate: null,
            email: 'active.pi@example.com',
          },
        },
      ];
      manuscript.versionsCollection!.items[0]!.firstAuthorsCollection =
        undefined;
      manuscript.versionsCollection!.items[0]!.additionalAuthorsCollection =
        undefined;
      manuscript.versionsCollection!.items[0]!.correspondingAuthorCollection =
        undefined;

      const recipients = 'active.pi@example.com';

      contentfulGraphqlClientMock.request.mockResolvedValue({
        manuscripts: manuscript,
      });

      await manuscriptDataProvider.sendEmailNotification(
        'manuscript_submitted',
        manuscript.sys.id,
        true,
        '',
      );
      expect(mockedPostmark).toHaveBeenCalledWith(
        expect.objectContaining({ To: recipients }),
      );
    });
  });
});

describe('getLifecycleCode', () => {
  it('returns all appropriate values', () => {
    const lifecyclePairs: { name: ManuscriptLifecycle; value: string }[] = [
      { name: 'Draft Manuscript (prior to Publication)', value: 'G' },
      { name: 'Preprint', value: 'P' },
      { name: 'Publication', value: 'D' },
      { name: 'Publication with addendum or corrigendum', value: 'C' },
      { name: 'Typeset proof', value: 'T' },
      { name: 'Other', value: 'O' },
    ];
    lifecyclePairs.forEach(({ name, value }) => {
      expect(getLifecycleCode(name)).toBe(value);
    });
  });
});
