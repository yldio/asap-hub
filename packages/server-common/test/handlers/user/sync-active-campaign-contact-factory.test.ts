import { NotFoundError } from '@asap-hub/errors';

import {
  syncActiveCampaignContactFactory,
  UserController,
  UserEventBridgeEvent,
} from '../../../src/handlers/user';
import {
  getUserContentfulWebhookDetail,
  getUserDataObject,
  getUserResponse,
  getGP2UserResponse,
} from '../../fixtures/users.fixtures';
import { createEventBridgeEventMock } from '../../helpers/events';
import {
  mockGetContactIdByEmail,
  mockCreateContact,
  mockUpdateContact,
} from '../../mocks/active-campaign.mock';
import { loggerMock as logger, loggerMock } from '../../mocks/logger.mock';

const activeCampaignAccount = 'account';
const activeCampaignToken = 'token';
const activeCampaignId = '123';
const date = '2024-01-18T09:00:00.000Z';
const mockContactPayload = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@asap.com',
  fieldValues: [
    { field: '1', value: 'Brazil' },
    { field: '2', value: 'Alumni' },
    { field: '3', value: 'South America' },
  ],
};

describe('Sync ActiveCampaign Contact Factory', () => {
  const userController = {
    fetchById: jest.fn(),
    update: jest.fn(),
  } as unknown as jest.Mocked<UserController>;

  beforeEach(() => {
    mockCreateContact.mockResolvedValue({
      contact: {
        id: activeCampaignId,
        cdate: date,
        udate: date,
      },
    });
    mockUpdateContact.mockResolvedValue({
      contact: {
        id: activeCampaignId,
        cdate: date,
        udate: date,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const syncActiveCampaignContactHandler = syncActiveCampaignContactFactory(
    userController,
    loggerMock,
    mockGetContactIdByEmail,
    mockCreateContact,
    mockUpdateContact,
    activeCampaignAccount,
    activeCampaignToken,
    jest.fn().mockResolvedValue(mockContactPayload),
  );

  test('should create ActiveCampaign contact if user is onboarded and no contactId exists', async () => {
    const userId = getUserDataObject().id;
    const user = getUserResponse();
    userController.fetchById.mockResolvedValue(user);
    mockGetContactIdByEmail.mockResolvedValue(null);

    const event = getEventBridgeEventMock(userId);

    await syncActiveCampaignContactHandler(event);

    expect(userController.fetchById).toHaveBeenCalledWith(userId);
    expect(mockGetContactIdByEmail).toHaveBeenCalledWith(
      activeCampaignAccount,
      activeCampaignToken,
      user.email,
    );
    expect(mockCreateContact).toHaveBeenCalledWith(
      activeCampaignAccount,
      activeCampaignToken,
      mockContactPayload,
    );
    expect(userController.update).toHaveBeenCalledWith(user.id, {
      activeCampaignCreatedAt: new Date(date),
      activeCampaignId,
    });
    expect(logger.info).toHaveBeenCalledWith('Contact user-id-1 created');
  });

  it('should update ActiveCampaign contact if user is onboarded and contactId exists', async () => {
    const userId = getUserDataObject().id;
    const { activeCampaignId: _, ...user } = getGP2UserResponse();

    userController.fetchById.mockResolvedValue(user);
    mockGetContactIdByEmail.mockResolvedValue(activeCampaignId);

    const event = getEventBridgeEventMock(userId);

    await syncActiveCampaignContactHandler(event);

    expect(userController.fetchById).toHaveBeenCalledWith(userId);
    expect(mockGetContactIdByEmail).toHaveBeenCalledWith(
      activeCampaignAccount,
      activeCampaignToken,
      user.email,
    );
    expect(mockUpdateContact).toHaveBeenCalledWith(
      activeCampaignAccount,
      activeCampaignToken,
      activeCampaignId,
      mockContactPayload,
    );
    expect(userController.update).toHaveBeenCalledWith(user.id, {
      activeCampaignId,
    });
    expect(logger.info).toHaveBeenCalledWith(
      'Contact with cms id user-id-1 and active campaign id 123 updated',
    );
  });

  it('should handle NotFoundError and log a message', async () => {
    const userId = getUserDataObject().id;
    userController.fetchById.mockRejectedValueOnce(new NotFoundError());

    const event = getEventBridgeEventMock(userId);

    await syncActiveCampaignContactHandler(event);

    expect(userController.fetchById).toHaveBeenCalledWith(userId);
    expect(logger.info).toHaveBeenLastCalledWith(
      expect.any(Error),
      'User not found',
    );
  });

  it('should throw an error for unhandled exceptions', async () => {
    const userId = getUserDataObject().id;
    userController.fetchById.mockRejectedValueOnce(new Error());

    const event = getEventBridgeEventMock(userId);

    await expect(syncActiveCampaignContactHandler(event)).rejects.toThrow();

    expect(userController.fetchById).toHaveBeenCalledWith(userId);
    expect(logger.info).toHaveBeenLastCalledWith(
      expect.any(Error),
      'Error creating/updating user userId to Active Campaign',
    );
  });
});

const getEventBridgeEventMock = (userId: string): UserEventBridgeEvent =>
  createEventBridgeEventMock(
    getUserContentfulWebhookDetail(userId),
    'UsersPublished',
    userId,
  );
