import { SendEmail } from '@asap-hub/server-common';
import { RestUser } from '@asap-hub/squidex';
import { notFound } from '@hapi/boom';
import path from 'path';
import url from 'url';
import {
  inviteHandlerFactory,
  UserInviteEventBridgeEvent,
} from '../../../src/handlers/user';
import { restUserMock } from '../../fixtures/users.fixtures';
import { loggerMock as logger } from '../../mocks/logger.mock';
import { getSquidexClientMock } from '../../mocks/squidex-client.mock';

describe('Invite Handler', () => {
  const sendEmailMock: jest.MockedFunction<SendEmail> = jest.fn();
  const userClient = getSquidexClientMock<RestUser>();
  const origin = 'https://asap-hub.org';
  const inviteHandler = inviteHandlerFactory(
    sendEmailMock,
    userClient,
    origin,
    logger,
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should throw when the user is not found', async () => {
    userClient.fetchById.mockRejectedValueOnce(notFound());

    const event = getEventBridgeEventMock(restUserMock().id);

    await expect(inviteHandler(event)).rejects.toThrow(
      `Unable to find a user with ID ${restUserMock().id}`,
    );
  });

  test('Should throw when it fails to save the user code', async () => {
    const userWithoutConnection: RestUser = {
      ...restUserMock(),
      data: {
        ...restUserMock().data,
        connections: {
          iv: [],
        },
      },
    };
    userClient.fetchById.mockResolvedValueOnce(userWithoutConnection);
    userClient.patch.mockRejectedValueOnce(new Error('some error'));

    const event = getEventBridgeEventMock(restUserMock().id);

    await expect(inviteHandler(event)).rejects.toThrow(
      `Unable to save the code for the user with ID ${restUserMock().id}`,
    );
  });

  test('Should throw when it fails to send the email but still save the new invitation code', async () => {
    const userWithoutConnection: RestUser = {
      ...restUserMock(),
      data: {
        ...restUserMock().data,
        connections: {
          iv: [],
        },
      },
    };
    userClient.fetchById.mockResolvedValueOnce(userWithoutConnection);
    sendEmailMock.mockRejectedValueOnce(new Error('some error'));

    const event = getEventBridgeEventMock(restUserMock().id);

    await expect(inviteHandler(event)).rejects.toThrow(
      `Unable to send the email for the user with ID ${restUserMock().id}`,
    );
    expect(userClient.patch).toBeCalledWith(userWithoutConnection.id, {
      connections: {
        iv: [{ code: expect.any(String) }],
      },
    });
  });

  test('Should not send the invitation email for a user that already has the invitation code', async () => {
    const code = 'c6fdb21b-32f3-4549-ac17-d0c83dc5335b';
    const userWithConnection: RestUser = {
      ...restUserMock(),
      data: {
        ...restUserMock().data,
        connections: {
          iv: [
            {
              code,
            },
          ],
        },
      },
    };
    userClient.fetchById.mockResolvedValueOnce(userWithConnection);

    const event = getEventBridgeEventMock(restUserMock().id);

    await inviteHandler(event);

    expect(userClient.fetchById).toBeCalledWith(userWithConnection.id);
    expect(sendEmailMock).not.toBeCalled();
  });

  test('Should find the user with a non-matching invitation code, create an invitation code and send the invitation email', async () => {
    const userWithOtherConnection: RestUser = {
      ...restUserMock(),
      data: {
        ...restUserMock().data,
        connections: {
          iv: [
            {
              code: 'some-other-code',
            },
          ],
        },
      },
    };
    userClient.fetchById.mockResolvedValueOnce(userWithOtherConnection);

    const event = getEventBridgeEventMock(restUserMock().id);

    await inviteHandler(event);

    expect(userClient.fetchById).toBeCalledWith(userWithOtherConnection.id);
    expect(userClient.patch).toBeCalledWith(userWithOtherConnection.id, {
      connections: {
        iv: [{ code: expect.any(String) }],
      },
    });
    const code = userClient.patch.mock.calls[0]![1].connections!.iv![0]!.code;
    const expectedLink = new url.URL(path.join(`/welcome/${code}`), origin);
    expect(sendEmailMock).toBeCalledWith({
      to: [userWithOtherConnection.data.email.iv],
      template: 'Crn-Welcome',
      values: {
        firstName: userWithOtherConnection.data.firstName.iv,
        link: expectedLink.toString(),
      },
    });
  });

  test('Should find the user without an invitation code, create the invitation code and send the invitation email', async () => {
    const userWithoutConnection: RestUser = {
      ...restUserMock(),
      data: {
        ...restUserMock().data,
        connections: {
          iv: [],
        },
      },
    };
    userClient.fetchById.mockResolvedValueOnce(userWithoutConnection);

    const event = getEventBridgeEventMock(restUserMock().id);

    await inviteHandler(event);

    expect(userClient.fetchById).toBeCalledWith(userWithoutConnection.id);
    expect(userClient.patch).toBeCalledWith(userWithoutConnection.id, {
      connections: {
        iv: [{ code: expect.any(String) }],
      },
    });
    const code = userClient.patch.mock.calls[0]![1].connections!.iv![0]!.code;
    const expectedLink = new url.URL(path.join(`/welcome/${code}`), origin);
    expect(sendEmailMock).toBeCalledWith({
      to: [userWithoutConnection.data.email.iv],
      template: 'Crn-Welcome',
      values: {
        firstName: userWithoutConnection.data.firstName.iv,
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
