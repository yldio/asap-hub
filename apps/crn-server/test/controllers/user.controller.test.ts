import { GenericError, NotFoundError } from '@asap-hub/errors';
import {
  createContact,
  getCustomFields,
  updateContact,
} from '@asap-hub/server-common';
import nock from 'nock';
import Users from '../../src/controllers/user.controller';
import * as orcidFixtures from '../fixtures/orcid.fixtures';
import {
  getUserDataObject,
  getUserListItemDataObject,
  getUserListItemResponse,
  getUserResponse,
} from '../fixtures/users.fixtures';
import { getDataProviderMock } from '../mocks/data-provider.mock';

jest.mock('@asap-hub/server-common', () => ({
  ...jest.requireActual('@asap-hub/server-common'),
  getCustomFields: jest.fn(),
  createContact: jest.fn(),
  updateContact: jest.fn(),
}));

const mockGetCustomFields = getCustomFields as jest.MockedFunction<
  typeof getCustomFields
>;

const mockCreateContact = createContact as jest.MockedFunction<
  typeof createContact
>;

const mockUpdateContact = updateContact as jest.MockedFunction<
  typeof updateContact
>;

describe('Users controller', () => {
  const assetDataProviderMock = getDataProviderMock();
  const userDataProviderMock = getDataProviderMock();
  const userController = new Users(userDataProviderMock, assetDataProviderMock);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch', () => {
    test('Should return the users', async () => {
      userDataProviderMock.fetch.mockResolvedValue({
        total: 1,
        items: [getUserListItemDataObject()],
      });
      const result = await userController.fetch({});

      expect(result).toEqual({ items: [getUserListItemResponse()], total: 1 });
    });

    test('Should return empty list when there are no users', async () => {
      userDataProviderMock.fetch.mockResolvedValue({ total: 0, items: [] });
      const result = await userController.fetch({});

      expect(result).toEqual({ items: [], total: 0 });
    });
  });

  describe('FetchById', () => {
    test('Should throw when user is not found', async () => {
      userDataProviderMock.fetchById.mockResolvedValue(null);

      await expect(userController.fetchById('not-found')).rejects.toThrow(
        NotFoundError,
      );
    });

    test('Should return the user when it finds it', async () => {
      userDataProviderMock.fetchById.mockResolvedValue(getUserDataObject());
      const result = await userController.fetchById('user-id');

      expect(result).toEqual(getUserResponse());
    });

    test('Should default onboarded flag to true when its null', async () => {
      const userData = getUserDataObject();
      userData.onboarded = null;
      userDataProviderMock.fetchById.mockResolvedValue(userData);
      const result = await userController.fetchById('user-id');

      expect(result?.onboarded).toEqual(true);
    });

    describe('Display name', () => {
      test('Should drop nickname and middle name when not available', async () => {
        const user = getUserDataObject();
        user.firstName = 'John';
        user.lastName = 'Smith';
        delete user.middleName;
        delete user.nickname;

        userDataProviderMock.fetchById.mockResolvedValue(user);
        const { displayName } = await userController.fetchById(user.id);

        expect(displayName).toEqual('John Smith');
      });

      test('Should use all middle name initials', async () => {
        const user = getUserDataObject();
        user.firstName = 'John';
        user.middleName = 'Wilbur Thomas Geofrey';
        user.lastName = 'Smith';
        delete user.nickname;

        userDataProviderMock.fetchById.mockResolvedValue(user);
        const { displayName } = await userController.fetchById(user.id);

        expect(displayName).toEqual('John W. T. G. Smith');
      });

      test('Should put any nickname in brackets', async () => {
        const user = getUserDataObject();
        user.firstName = 'John';
        user.nickname = 'R2 D2';
        user.lastName = 'Smith';
        delete user.middleName;

        userDataProviderMock.fetchById.mockResolvedValue(user);
        const { displayName } = await userController.fetchById(user.id);

        expect(displayName).toEqual('John (R2 D2) Smith');
      });
    });
  });

  describe('fetchByCode', () => {
    const code = 'some-uuid-code';

    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('Should return the users', async () => {
      userDataProviderMock.fetch.mockResolvedValue({
        total: 1,
        items: [getUserListItemResponse()],
      });

      userDataProviderMock.fetchById.mockResolvedValue(
        getUserListItemResponse(),
      );

      const result = await userController.fetchByCode(code);

      expect(result).toEqual(getUserListItemResponse());
    });

    test('Should call the data provider with correct parameters', async () => {
      userDataProviderMock.fetch.mockResolvedValue({
        total: 1,
        items: [getUserListItemResponse()],
      });

      userDataProviderMock.fetchById.mockResolvedValue(
        getUserListItemResponse(),
      );

      await userController.fetchByCode(code);

      expect(userDataProviderMock.fetch).toHaveBeenCalledWith({
        filter: { code, hidden: false, onboarded: false },
        take: 1,
        skip: 0,
      });
    });

    test('Should throw 404 when no user is found', async () => {
      userDataProviderMock.fetch.mockResolvedValue({ total: 0, items: [] });

      await expect(userController.fetchByCode(code)).rejects.toThrow(
        NotFoundError,
      );
    });

    test('Should throw when it finds more than one user', async () => {
      userDataProviderMock.fetch.mockResolvedValue({
        total: 2,
        items: [getUserDataObject(), getUserDataObject()],
      });

      await expect(userController.fetchByCode(code)).rejects.toThrow(
        GenericError,
      );
    });

    test('throws if user is not found', async () => {
      userDataProviderMock.fetch.mockResolvedValue({
        total: 1,
        items: [getUserListItemResponse()],
      });

      userDataProviderMock.fetchById.mockReturnValue(null);

      await expect(userController.fetchByCode(code)).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  describe('update', () => {
    test('Should return the newly updated user', async () => {
      const mockResponse = getUserDataObject();
      userDataProviderMock.fetchById.mockResolvedValue(mockResponse);
      const result = await userController.update('user-id', {});

      expect(result).toEqual(getUserResponse());
      expect(userDataProviderMock.update).toHaveBeenCalledWith(
        'user-id',
        {},
        { suppressConflict: false },
      );
    });
  });

  describe('updateAvatar', () => {
    beforeEach(nock.cleanAll);

    test('should return 200 when syncs asset and updates users profile', async () => {
      assetDataProviderMock.create.mockResolvedValueOnce('42');
      userDataProviderMock.fetchById.mockResolvedValueOnce(getUserDataObject());
      const result = await userController.updateAvatar(
        'user-id',
        Buffer.from('avatar'),
        'image/jpeg',
      );

      expect(result).toEqual(getUserResponse());
      expect(nock.isDone()).toBe(true);
      expect(userDataProviderMock.update).toHaveBeenCalledWith(
        'user-id',
        {
          avatar: '42',
        },
        { suppressConflict: false },
      );
      expect(assetDataProviderMock.create).toHaveBeenCalledWith({
        id: 'user-id',
        avatar: Buffer.from('avatar'),
        contentType: 'image/jpeg',
      });
      expect(userDataProviderMock.fetchById).toHaveBeenCalledWith('user-id');
    });
  });

  describe('connectByCode', () => {
    test('should replace the welcome code with the connection code and return the user on success', async () => {
      const userId = '42';
      const user = getUserDataObject();
      const welcomeCode = 'welcome-code';
      user.connections = [{ code: welcomeCode }];
      userDataProviderMock.fetch.mockResolvedValue({
        total: 1,
        items: [{ ...user, id: userId }],
      });

      userDataProviderMock.fetchById.mockResolvedValue({ ...user, id: userId });

      const result = await userController.connectByCode(welcomeCode, 'user-id');

      expect(userDataProviderMock.update).toHaveBeenCalledWith(
        userId,
        {
          email: user.email,
          connections: [{ code: 'user-id' }],
        },
        { suppressConflict: false },
      );
      expect(result).toEqual({
        ...getUserResponse(),
        id: userId,
      });
    });

    test('should keep the existing connections when creating a new one', async () => {
      const userId = '42';
      const user = getUserDataObject();
      const existingConnection = 'auth0|123456';
      const welcomeCode = 'welcome-code';
      user.connections = [{ code: existingConnection }, { code: welcomeCode }];
      userDataProviderMock.fetch.mockResolvedValue({
        total: 1,
        items: [{ ...user, id: userId }],
      });
      userDataProviderMock.fetchById.mockResolvedValue({ ...user, id: userId });
      await userController.connectByCode(welcomeCode, 'user-id');

      expect(userDataProviderMock.update).toHaveBeenCalledWith(
        userId,
        {
          email: user.email,
          connections: expect.arrayContaining([
            {
              code: existingConnection,
            },
          ]),
        },
        { suppressConflict: false },
      );
    });

    test('Shouldnt do anything if connecting with existing code', async () => {
      const userId = '42';
      const userCode = 'google-oauth2|token';
      userDataProviderMock.fetch.mockResolvedValue({
        total: 1,
        items: [
          {
            ...getUserDataObject(),
            id: userId,
            connections: [{ code: userCode }],
          },
        ],
      });
      userDataProviderMock.fetchById.mockResolvedValue({
        ...getUserDataObject(),
        id: userId,
        connections: [{ code: userCode }],
      });
      const result = await userController.connectByCode(
        'asapWelcomeCode',
        userCode,
      );

      expect(userDataProviderMock.update).not.toHaveBeenCalled();
      expect(result).toBeDefined();
    });
    test('throws if no user is returned', async () => {
      userDataProviderMock.fetch.mockResolvedValue({ total: 0, items: [] });

      await expect(
        userController.connectByCode('some code', 'user-id'),
      ).rejects.toThrow(NotFoundError);
    });

    test('throws if user is not found', async () => {
      userDataProviderMock.fetch.mockResolvedValue({
        total: 1,
        items: [
          {
            ...getUserDataObject(),
            connections: [{ code: 'google-oauth2|token' }],
          },
        ],
      });
      userDataProviderMock.fetchById.mockReturnValue(null);

      await expect(
        userController.connectByCode('some code', 'user-id'),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('syncOrcidProfile', () => {
    const userId = 'userId';
    const orcid = '363-98-9330';

    test('should successfully fetch and update user - with id', async () => {
      const user = { ...getUserDataObject(), orcid };
      userDataProviderMock.fetchById.mockResolvedValue(user);

      nock('https://pub.orcid.org')
        .get(`/v2.1/${orcid}/works`)
        .reply(200, orcidFixtures.orcidWorksResponse);

      const result = await userController.syncOrcidProfile(userId);

      expect(userDataProviderMock.update).toHaveBeenCalled();
      expect(result).toEqual({ ...getUserResponse(), orcid });
      expect(userDataProviderMock.update).toHaveBeenCalledWith(
        user.id,
        expect.objectContaining({
          email: user.email,
          orcidLastModifiedDate: '2020-07-14T01:36:15.911Z',
          orcidWorks: orcidFixtures.orcidWorksDeserialisedExpectation,
        }),
        { suppressConflict: true },
      );
    });

    test('successfully fetch and update user - with user', async () => {
      const user = { ...getUserDataObject(), orcid };
      userDataProviderMock.fetchById.mockResolvedValue(user);

      nock('https://pub.orcid.org')
        .get(`/v2.1/${orcid}/works`)
        .reply(200, orcidFixtures.orcidWorksResponse);

      const result = await userController.syncOrcidProfile(userId, {
        ...getUserResponse(),
        email: 'cache-user-email',
        orcid,
      });

      expect(userDataProviderMock.update).toHaveBeenCalled();
      expect(userDataProviderMock.update).toHaveBeenCalledWith(
        user.id,
        expect.objectContaining({
          email: 'cache-user-email',
          orcidLastModifiedDate: '2020-07-14T01:36:15.911Z',
          orcidWorks: orcidFixtures.orcidWorksDeserialisedExpectation,
        }),
        { suppressConflict: true },
      );
      expect(result).toEqual({ ...getUserResponse(), orcid });
    });

    test('Should update user profile orcidLastSyncDate when ORCID returns 500', async () => {
      const user = { ...getUserDataObject(), orcid };
      userDataProviderMock.fetchById.mockResolvedValue(user);

      nock('https://pub.orcid.org')
        .get(`/v2.1/${orcid}/works`)
        .times(3)
        .reply(502, orcidFixtures.orcidWorksResponse);

      const result = await userController.syncOrcidProfile(userId, {
        ...getUserResponse(),
        email: user.email,
        orcid,
      });

      expect(userDataProviderMock.update).toHaveBeenCalled();
      expect(userDataProviderMock.update).toHaveBeenCalledWith(
        user.id,
        {
          email: user.email,
          orcidLastSyncDate: expect.any(String),
        },
        { suppressConflict: true },
      );
      expect(result).toEqual({ ...getUserResponse(), orcid });
    });

    test('Should update user profile orcidLastSyncDate when last-modified-date is null', async () => {
      const user = { ...getUserDataObject(), orcid };
      userDataProviderMock.fetchById.mockResolvedValue(user);

      const orcidWorksResponse = {
        ...orcidFixtures.orcidWorksResponse,
      };
      orcidWorksResponse['last-modified-date'] = null;

      nock('https://pub.orcid.org')
        .get(`/v2.1/${orcid}/works`)
        .reply(200, orcidWorksResponse);

      await userController.syncOrcidProfile(userId);

      expect(userDataProviderMock.update).toHaveBeenCalledWith(
        user.id,
        {
          email: user.email,
          orcidLastSyncDate: expect.any(String),
        },
        { suppressConflict: true },
      );
    });

    test('Throws when user does not exist', async () => {
      userDataProviderMock.fetchById.mockResolvedValue(null);

      await expect(
        userController.syncOrcidProfile('user-not-found'),
      ).rejects.toThrow(NotFoundError);
    });

    test('should convert the modified date to ISO before sending to data provider', async () => {
      const user = { ...getUserDataObject(), orcid };
      userDataProviderMock.fetchById.mockResolvedValue(user);

      const orcidWorksResponse = {
        ...orcidFixtures.orcidWorksResponse,
      };
      orcidWorksResponse['last-modified-date'] = { value: 1594690575911 };

      nock('https://pub.orcid.org')
        .get(`/v2.1/${orcid}/works`)
        .reply(200, orcidWorksResponse);

      await userController.syncOrcidProfile(userId);

      expect(userDataProviderMock.update).toHaveBeenCalledWith(
        user.id,
        expect.objectContaining({
          orcidLastModifiedDate: new Date(
            orcidFixtures.orcidWorksResponse['last-modified-date']!.value,
          ).toISOString(),
        }),
        { suppressConflict: true },
      );
    });
  });

  describe('ActiveCampaign', () => {
    const customFieldsMock = {
      fields: [
        { title: 'Team', id: '10' },
        { title: 'CRN Team Role', id: '15' },
        { title: 'ORCID', id: '16' },
        { title: 'Nickname', id: '19' },
        { title: 'Middlename', id: '20' },
        { title: 'Alumnistatus', id: '12' },
        { title: 'Country', id: '3' },
        { title: 'Institution', id: '9' },
        { title: 'LinkedIn', id: '28' },
      ],
    };

    describe('createActiveCampaignContact', () => {
      test('calls createContact function and updates user with ActiveCampaign createAt and id', async () => {
        const user = getUserResponse();

        mockGetCustomFields.mockResolvedValue(customFieldsMock);

        const activeCampaignId = '123';
        const date = '2024-01-18T09:00:00.000Z';
        mockCreateContact.mockResolvedValue({
          contact: {
            id: activeCampaignId,
            cdate: date,
            udate: date,
          },
        });

        await userController.createActiveCampaignContact(user);

        expect(mockCreateContact).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(String),
          {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            fieldValues: [
              { field: '10', value: '||Team Team A||' },
              { field: '15', value: '||Team Lead PI (Core Leadership)||' },
              { field: '16', value: user.orcid },
              { field: '19', value: user.nickname },
              { field: '20', value: user.middleName },
              { field: '3', value: user.country },
              { field: '9', value: user.institution },
              { field: '28', value: '' },
            ],
          },
        );

        expect(userDataProviderMock.update).toHaveBeenCalledWith(user.id, {
          activeCampaignCreatedAt: new Date(date),
          activeCampaignId: activeCampaignId,
        });
      });
    });

    describe('updateActiveCampaignContact', () => {
      test('calls updateContact function when user has an activeCampaignId', async () => {
        const activeCampaignId = '2';

        const user = {
          ...getUserResponse(),
          activeCampaignId,
        };

        mockGetCustomFields.mockResolvedValue(customFieldsMock);

        const date = '2024-01-18T09:00:00.000Z';
        mockUpdateContact.mockResolvedValue({
          contact: {
            id: activeCampaignId,
            cdate: date,
            udate: date,
          },
        });

        await userController.updateActiveCampaignContact(user);

        expect(mockUpdateContact).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(String),
          activeCampaignId,
          {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            fieldValues: [
              { field: '10', value: '||Team Team A||' },
              { field: '15', value: '||Team Lead PI (Core Leadership)||' },
              { field: '16', value: user.orcid },
              { field: '19', value: user.nickname },
              { field: '20', value: user.middleName },
              { field: '3', value: user.country },
              { field: '9', value: user.institution },
              { field: '28', value: '' },
            ],
          },
        );
      });

      test('does not call updateContact function when user does not have an activeCampaignId', async () => {
        const user = getUserResponse();

        mockGetCustomFields.mockResolvedValue(customFieldsMock);

        await userController.updateActiveCampaignContact(user);

        expect(mockUpdateContact).not.toHaveBeenCalled();
      });
    });
  });
});
