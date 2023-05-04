import path from 'path';
import url from 'url';
import {
  inviteHandlerFactory,
  UserInviteEventBridgeEvent,
} from '../../../src/handlers/user';
import { crnWelcomeTemplate, SendEmail } from '../../../src/utils';
import { getUserDataObject } from '../../fixtures/users.fixtures';
import { loggerMock as logger } from '../../mocks/logger.mock';

describe('Invite Handler', () => {
  const sendEmailMock: jest.MockedFunction<SendEmail> = jest.fn();
  const origin = 'https://asap-hub.org';
  const dataProvider = {
    fetchById: jest.fn(),
    update: jest.fn(),
  };
  const inviteHandler = inviteHandlerFactory(
    sendEmailMock,
    dataProvider,
    origin,
    logger,
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('Should throw when the user is not found', async () => {
    dataProvider.fetchById.mockResolvedValueOnce(null);

    const event = getEventBridgeEventMock(getUserDataObject().id);

    await expect(inviteHandler(event)).rejects.toThrow(
      `Unable to find a user with ID ${getUserDataObject().id}`,
    );
  });

  test('Should throw when it fails to save the user code', async () => {
    const userWithoutConnection: UserDataObject = {
      ...getUserDataObject(),
      connections: [],
    };
    dataProvider.fetchById.mockResolvedValueOnce(userWithoutConnection);
    dataProvider.update.mockRejectedValueOnce(new Error('some error'));

    const event = getEventBridgeEventMock(getUserDataObject().id);

    await expect(inviteHandler(event)).rejects.toThrow(
      `Unable to save the code for the user with ID ${getUserDataObject().id}`,
    );
  });

  test('Should throw when it fails to send the email but still save the new invitation code', async () => {
    const userWithoutConnection: UserDataObject = {
      ...getUserDataObject(),
      connections: [],
    };
    dataProvider.fetchById.mockResolvedValueOnce(userWithoutConnection);
    dataProvider.update.mockResolvedValueOnce(null);
    sendEmailMock.mockRejectedValueOnce(new Error('some error'));

    const event = getEventBridgeEventMock(getUserDataObject().id);

    await expect(inviteHandler(event)).rejects.toThrow(
      `Unable to send the email for the user with ID ${getUserDataObject().id}`,
    );
    expect(dataProvider.update).toBeCalledWith(userWithoutConnection.id, {
      connections: [{ code: expect.any(String) }],
    });
  });

  test('Should not send the invitation email for a user that already has the invitation code', async () => {
    const code = 'c6fdb21b-32f3-4549-ac17-d0c83dc5335b';
    const userWithConnection: UserDataObject = {
      ...getUserDataObject(),
      connections: [{ code }],
    };
    dataProvider.fetchById.mockResolvedValueOnce(userWithConnection);

    const event = getEventBridgeEventMock(getUserDataObject().id);

    await inviteHandler(event);

    expect(dataProvider.fetchById).toBeCalledWith(userWithConnection.id);
    expect(sendEmailMock).not.toBeCalled();
  });

  test('Should not send the invitation email for a user that already has an authentication code', async () => {
    const connectionCode = 'auth0|some-other-id';
    const userWithOtherConnection: UserDataObject = {
      ...getUserDataObject(),
      connections: [
        {
          code: connectionCode,
        },
      ],
    };
    dataProvider.fetchById.mockResolvedValueOnce(userWithOtherConnection);

    const event = getEventBridgeEventMock(getUserDataObject().id);

    await inviteHandler(event);

    expect(dataProvider.fetchById).toBeCalledWith(userWithOtherConnection.id);
    expect(dataProvider.update).not.toHaveBeenCalled();
    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  test('Should find the user without an invitation code, create the invitation code and send the invitation email', async () => {
    const userWithoutConnection: UserDataObject = {
      ...getUserDataObject(),
      connections: [],
    };
    dataProvider.fetchById.mockResolvedValueOnce(userWithoutConnection);

    const event = getEventBridgeEventMock(getUserDataObject().id);

    await inviteHandler(event);

    expect(dataProvider.fetchById).toBeCalledWith(userWithoutConnection.id);
    expect(dataProvider.update).toBeCalledWith(userWithoutConnection.id, {
      connections: [{ code: expect.any(String) }],
    });
    const code = dataProvider.update.mock.calls[0]![1].connections![0]!.code;
    const expectedLink = new url.URL(path.join(`/welcome/${code}`), origin);
    expect(sendEmailMock).toBeCalledWith({
      to: [userWithoutConnection.email],
      template: crnWelcomeTemplate,
      values: {
        firstName: userWithoutConnection.firstName,
        link: expectedLink.toString(),
      },
    });
  });
});

const getEventBridgeEventMock = (
  userId?: string,
): UserInviteEventBridgeEvent => ({
  id: 'test-id',
  version: '1',
  account: 'test-account',
  time: '3234234234',
  region: 'eu-west-1',
  resources: [],
  source: 'asap.user',
  'detail-type': 'UsersPublished',
  detail: {
    type: 'UsersPublished',
    resourceId: userId || '0ecccf93-bd06-4307-90ea-c153fe495580',
    payload: {
      $type: 'EnrichedContentEvent',
      type: 'Published',
      id: userId || '0ecccf93-bd06-4307-90ea-c153fe495580',
      created: '2021-02-15T13:11:25Z',
      lastModified: '2021-02-15T13:11:25Z',
      version: 1,
      data: {},
    },
  },
});
