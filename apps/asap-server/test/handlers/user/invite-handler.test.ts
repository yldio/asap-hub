import { RestUser } from '@asap-hub/squidex';
import { EventBridgeEvent } from 'aws-lambda';
import path from 'path';
import url from 'url';
import { origin } from '../../../src/config';
import {
  inviteHandlerFactory,
  SquidexWebhookUserPayload,
} from '../../../src/handlers/user/invite-handler';
import { SendEmail } from '../../../src/utils/send-email';
import { restUserMock } from '../../fixtures/users.fixtures';
import { getSquidexClientMock } from '../../mocks/squidex-client.mock';

describe('Invite Handler', () => {
  const sendEmailMock: jest.MockedFunction<SendEmail> = jest.fn();
  const userClient = getSquidexClientMock<RestUser>();
  const inviteHandler = inviteHandlerFactory(sendEmailMock, userClient);

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should find the user with invitation code and send the invitation email', async () => {
    const code = 'c6fdb21b-32f3-4549-ac17-d0c83dc5335b';
    const userWithConnection: RestUser = {
      ...restUserMock,
      data: {
        ...restUserMock.data,
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

    const event = getEventBridgeEventMock(restUserMock.id);

    await inviteHandler(event);

    const expectedLink = new url.URL(path.join(`/welcome/${code}`), origin);
    expect(userClient.fetchById).toBeCalledWith(userWithConnection.id);
    expect(sendEmailMock).toBeCalledWith({
      to: [userWithConnection.data.email.iv],
      template: 'Invite',
      values: {
        firstName: userWithConnection.data.firstName.iv,
        link: expectedLink.toString(),
      },
    });
  });

  test('Should find the user with a non-matching invitation code, create an invitation code and send the invitation email', async () => {
    const userWithOtherConnection: RestUser = {
      ...restUserMock,
      data: {
        ...restUserMock.data,
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

    const event = getEventBridgeEventMock(restUserMock.id);

    await inviteHandler(event);

    expect(userClient.fetchById).toBeCalledWith(userWithOtherConnection.id);
    expect(userClient.patch).toBeCalledWith(userWithOtherConnection.id, {
      connections: {
        iv: [{ code: expect.any(String) }],
      },
    });
    const code = userClient.patch.mock.calls[0][1].connections!.iv![0].code;
    const expectedLink = new url.URL(path.join(`/welcome/${code}`), origin);
    expect(sendEmailMock).toBeCalledWith({
      to: [userWithOtherConnection.data.email.iv],
      template: 'Invite',
      values: {
        firstName: userWithOtherConnection.data.firstName.iv,
        link: expectedLink.toString(),
      },
    });
  });

  test('Should find the user without an invitation code, create the invitation code and send the invitation email', async () => {
    const userWithoutConnection: RestUser = {
      ...restUserMock,
      data: {
        ...restUserMock.data,
        connections: {
          iv: [],
        },
      },
    };
    userClient.fetchById.mockResolvedValueOnce(userWithoutConnection);

    const event = getEventBridgeEventMock(restUserMock.id);

    await inviteHandler(event);

    expect(userClient.fetchById).toBeCalledWith(userWithoutConnection.id);
    expect(userClient.patch).toBeCalledWith(userWithoutConnection.id, {
      connections: {
        iv: [{ code: expect.any(String) }],
      },
    });
    const code = userClient.patch.mock.calls[0][1].connections!.iv![0].code;
    const expectedLink = new url.URL(path.join(`/welcome/${code}`), origin);
    expect(sendEmailMock).toBeCalledWith({
      to: [userWithoutConnection.data.email.iv],
      template: 'Invite',
      values: {
        firstName: userWithoutConnection.data.firstName.iv,
        link: expectedLink.toString(),
      },
    });
  });
});

const getEventBridgeEventMock = (
  userId?: string,
): EventBridgeEvent<'UserCreated', SquidexWebhookUserPayload> => ({
  id: 'test-id',
  version: '1',
  account: 'test-account',
  time: '3234234234',
  region: 'eu-west-1',
  resources: [],
  source: 'asap.user',
  'detail-type': 'UserCreated',
  detail: {
    type: 'UsersCreated',
    payload: {
      $type: 'EnrichedContentEvent',
      type: 'Created',
      id: userId || '0ecccf93-bd06-4307-90ea-c153fe495580',
    },
  },
});
