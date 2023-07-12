import {
  Environment,
  getGP2ContentfulGraphqlClientMockServer,
  gp2 as gp2Contentful,
} from '@asap-hub/contentful';
import { GenericError } from '@asap-hub/errors';
import { gp2 as gp2Model } from '@asap-hub/model';
import { ExternalUserContentfulDataProvider } from '../../src/data-providers/external-user.data-provider';
import { getEntry } from '../fixtures/contentful.fixtures';
import {
  getContentfulGraphqlExternalUser,
  getContentfulGraphqlExternalUsersResponse,
  getExternalUserCreateDataObject,
  getExternalUserDataObject,
} from '../fixtures/external-users.fixtures';
import { getContentfulGraphqlClientMock } from '../mocks/contentful-graphql-client.mock';
import { getContentfulEnvironmentMock } from '../mocks/contentful-rest-client.mock';

describe('External User Contentful Data Provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
  const environmentMock = getContentfulEnvironmentMock();
  const contentfulRestClientMock: () => Promise<Environment> = () =>
    Promise.resolve(environmentMock);

  const externalUserDataProvider = new ExternalUserContentfulDataProvider(
    contentfulGraphqlClientMock,
    contentfulRestClientMock,
  );

  const contentfulGraphqlClientMockServer =
    getGP2ContentfulGraphqlClientMockServer({
      ExternalUsers: () => getContentfulGraphqlExternalUser(),
    });

  const externalUsersDataProviderMockGraphql =
    new ExternalUserContentfulDataProvider(
      contentfulGraphqlClientMockServer,
      contentfulRestClientMock,
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Fetch method', () => {
    test('Should fetch the list of external users from Contentful Graphql', async () => {
      const result = await externalUsersDataProviderMockGraphql.fetch({});

      expect(result).toMatchObject({
        total: 1,
        items: [getExternalUserDataObject()],
      });
    });

    test('Should return an empty result when no external users are found', async () => {
      const contentfulGraphqlResponse =
        getContentfulGraphqlExternalUsersResponse();
      contentfulGraphqlResponse.externalUsersCollection!.total = 0;
      contentfulGraphqlResponse.externalUsersCollection!.items = [];
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphqlResponse,
      );

      const result = await externalUserDataProvider.fetch({});

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should return an empty result when the client returns a response with query property set to null', async () => {
      const contentfulGraphqlResponse =
        getContentfulGraphqlExternalUsersResponse();
      contentfulGraphqlResponse.externalUsersCollection = null;
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphqlResponse,
      );

      const result = await externalUserDataProvider.fetch({});

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should use take and skip parameters', async () => {
      const contentfulGraphqlResponse =
        getContentfulGraphqlExternalUsersResponse();
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphqlResponse,
      );

      const result = await externalUserDataProvider.fetch({
        take: 15,
        skip: 11,
      });

      expect(result).toEqual({
        items: [getExternalUserDataObject()],
        total: 1,
      });

      expect(contentfulGraphqlClientMock.request).toBeCalledWith(
        gp2Contentful.FETCH_EXTERNAL_USERS,
        expect.objectContaining({
          limit: 15,
          order: ['name_ASC'],
          skip: 11,
          where: {},
        }),
      );
    });
    describe('search', () => {
      test('Should query with filters and return the external-users', async () => {
        const contentfulGraphqlResponse =
          getContentfulGraphqlExternalUsersResponse();
        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          contentfulGraphqlResponse,
        );
        const fetchOptions: gp2Model.FetchExternalUsersOptions = {
          take: 12,
          skip: 2,
          search: 'tony stark',
        };
        const users = await externalUserDataProvider.fetch(fetchOptions);

        expect(contentfulGraphqlClientMock.request).toBeCalledWith(
          gp2Contentful.FETCH_EXTERNAL_USERS,
          {
            limit: 12,
            skip: 2,
            order: ['name_ASC'],
            where: expect.objectContaining({
              AND: [
                {
                  OR: [
                    {
                      name_contains: 'tony',
                    },
                  ],
                },
                {
                  OR: [
                    {
                      name_contains: 'stark',
                    },
                  ],
                },
              ],
            }),
          },
        );
        expect(users).toMatchObject({
          total: 1,
          items: [getExternalUserDataObject()],
        });
      });
    });
  });

  describe('Fetch-by-id method', () => {
    test('not implemented', async () => {
      expect(async () =>
        externalUsersDataProviderMockGraphql.fetchById(),
      ).rejects.toThrow();
    });
  });

  describe('Create method', () => {
    test('Should create an external user', async () => {
      const externalUserCreateDataObject = getExternalUserCreateDataObject();

      const externalUserMock = getEntry({});
      externalUserMock.sys.id = 'user-1';
      environmentMock.createEntry.mockResolvedValueOnce(externalUserMock);
      externalUserMock.publish = jest
        .fn()
        .mockResolvedValueOnce(externalUserMock);

      const result = await externalUserDataProvider.create(
        externalUserCreateDataObject,
      );

      expect(environmentMock.createEntry).toHaveBeenCalledWith(
        'externalUsers',
        {
          fields: {
            name: { 'en-US': externalUserCreateDataObject.name },
            orcid: { 'en-US': externalUserCreateDataObject.orcid },
          },
        },
      );
      expect(result).toEqual('user-1');
    });

    test('Should create an external user without ORCID', async () => {
      const externalUserCreateDataObject = getExternalUserCreateDataObject();
      delete externalUserCreateDataObject.orcid;

      const externalUserMock = getEntry({});
      externalUserMock.sys.id = 'user-1';
      environmentMock.createEntry.mockResolvedValueOnce(externalUserMock);
      externalUserMock.publish = jest
        .fn()
        .mockResolvedValueOnce(externalUserMock);

      const result = await externalUserDataProvider.create(
        externalUserCreateDataObject,
      );

      expect(environmentMock.createEntry).toHaveBeenCalledWith(
        'externalUsers',
        {
          fields: {
            name: { 'en-US': externalUserCreateDataObject.name },
            orcid: { 'en-US': undefined },
          },
        },
      );
      expect(result).toEqual('user-1');
    });

    test('Should throw when fails to create the external user', async () => {
      const externalUserCreateDataObject = getExternalUserCreateDataObject();

      environmentMock.createEntry.mockRejectedValueOnce(new GenericError());

      await expect(
        externalUserDataProvider.create(externalUserCreateDataObject),
      ).rejects.toThrow(GenericError);
    });
  });
});
