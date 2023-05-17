import {
  Environment,
  getGP2ContentfulGraphqlClientMockServer,
} from '@asap-hub/contentful';
import { GenericError } from '@asap-hub/errors';
import { ExternalUserContentfulDataProvider } from '../../../src/data-providers/contentful/external-user.data-provider';
import { getEntry } from '../../fixtures/contentful.fixtures';
import {
  getContentfulGraphqlExternalUser,
  getContentfulGraphqlExternalUsersResponse,
  getExternalUserCreateDataObject,
  getExternalUserDataObject,
} from '../../fixtures/external-users.fixtures';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';
import { getContentfulEnvironmentMock } from '../../mocks/contentful-rest-client.mock';

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
        expect.anything(),
        {
          limit: 15,
          skip: 11,
          order: ['name_ASC'],
        },
      );
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
