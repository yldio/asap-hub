import { UserDataObject } from '@asap-hub/model';
import { SQSEvent } from 'aws-lambda';
import path from 'path';
import url from 'url';
import {
  inviteHandlerFactory,
  sqsInviteHandlerFactory,
  UserInviteEventBridgeEvent,
} from '../../../src/handlers/user';
import { crnWelcomeTemplate, SendEmail, SendEmailTemplate } from '../../../src/utils';
import { getUserDataObject } from '../../fixtures/users.fixtures';
import { loggerMock as logger } from '../../mocks/logger.mock';


describe('Invite Handler', () => {
  const origin = 'https://asap-hub.org';
  const sendEmailMock: jest.MockedFunction<SendEmail> = jest.fn();
  const dataProvider = {
    fetchById: jest.fn(),
    update: jest.fn(),
  };

  const inviteHandler = (suppressConflict?: boolean, templateName?: string) =>
    inviteHandlerFactory(
      sendEmailMock,
      dataProvider,
      origin,
      logger,
      suppressConflict,
      templateName,
      jest.fn(),
    );

  // Helper to stub a user with given connections
  const stubUser = (
    connections: Array<{ code: string }> = [],
  ): UserDataObject => ({
    ...getUserDataObject(),
    connections,
  });

  // Helper to assert that update() was called correctly
  const expectUpdate = (
    user: UserDataObject,
    conflictFlag: boolean = false,
  ) => {
    expect(dataProvider.update).toHaveBeenCalledWith(
      user.id,
      { connections: [{ code: expect.any(String) }] },
      { suppressConflict: conflictFlag },
    );
  };

  // Helper to assert that sendEmail() was called with the right link
  const expectEmail = (user: UserDataObject) => {
    const code = dataProvider.update.mock.calls[0]![1].connections![0]!.code;
    const link = new url.URL(path.join(`/welcome/${code}`), origin).toString();
    expect(sendEmailMock).toHaveBeenCalledWith({
      to: [user.email],
      template: crnWelcomeTemplate,
      values: { firstName: user.firstName, link },
    });
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('throws when the user is not found', async () => {
    dataProvider.fetchById.mockResolvedValueOnce(null);
    const handler = inviteHandler();
    const event = getEventBridgeEventMock(getUserDataObject().id);

    await expect(handler(event)).rejects.toThrow(
      `Unable to find a user with ID ${getUserDataObject().id}`,
    );
  });

  test('throws when it fails to save the user code', async () => {
    const user = stubUser([]);
    dataProvider.fetchById.mockResolvedValueOnce(user);
    dataProvider.update.mockRejectedValueOnce(new Error('some error'));
    const handler = inviteHandler();
    const event = getEventBridgeEventMock(user.id);

    await expect(handler(event)).rejects.toThrow(
      `Unable to save the code for the user with ID ${user.id}`,
    );
  });

  test('throws when email send fails but still saves code', async () => {
    const user = stubUser([]);
    dataProvider.fetchById.mockResolvedValueOnce(user);
    dataProvider.update.mockResolvedValueOnce(null);
    sendEmailMock.mockRejectedValueOnce(new Error('some error'));
    const handler = inviteHandler();
    const event = getEventBridgeEventMock(user.id);

    await expect(handler(event)).rejects.toThrow(
      `Unable to send the email for the user with ID ${user.id}`,
    );
    expectUpdate(user, false);
  });

  test('skips emailing when user already has an invite code', async () => {
    const code = 'c6fdb21b-32f3-4549-ac17-d0c83dc5335b';
    const user = stubUser([{ code }]);
    dataProvider.fetchById.mockResolvedValueOnce(user);
    const handler = inviteHandler();
    const event = getEventBridgeEventMock(user.id);

    await handler(event);

    expect(dataProvider.fetchById).toHaveBeenCalledWith(user.id);
    expect(sendEmailMock).not.toBeCalled();
  });

  test('skips everything when user already has an auth0 connection', async () => {
    const user = stubUser([{ code: 'auth0|some-other-id' }]);
    dataProvider.fetchById.mockResolvedValueOnce(user);
    const handler = inviteHandler();
    const event = getEventBridgeEventMock(user.id);

    await handler(event);

    expect(dataProvider.update).not.toHaveBeenCalled();
    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  test('creates code & sends email for a fresh user (default conflict=false)', async () => {
    const user = stubUser([]);
    dataProvider.fetchById.mockResolvedValueOnce(user);
    dataProvider.update.mockResolvedValueOnce(null);
    const handler = inviteHandler();
    const event = getEventBridgeEventMock(user.id);

    await handler(event);

    expectUpdate(user, false);
    expectEmail(user);
  });

  test('passes suppressConflict=true when configured', async () => {
    const user = stubUser([]);
    dataProvider.fetchById.mockResolvedValueOnce(user);
    dataProvider.update.mockResolvedValueOnce(null);
    const handler = inviteHandler(true, 'Crn-Welcome');
    const event = getEventBridgeEventMock(user.id);

    await handler(event);

    expectUpdate(user, true);
    expectEmail(user);
  });

  test('explicit false still results in suppressConflict=false', async () => {
    const user = stubUser([]);
    dataProvider.fetchById.mockResolvedValueOnce(user);
    dataProvider.update.mockResolvedValueOnce(null);
    const handler = inviteHandler(false, 'Crn-Welcome');
    const event = getEventBridgeEventMock(user.id);

    await handler(event);

    expectUpdate(user, false);
    expectEmail(user);
  });

  test('version mismatch error when suppressConflict flag is true', async () => {
    const user = stubUser([]);
    dataProvider.fetchById.mockResolvedValueOnce(user);
    const versionErr = new Error('Version mismatch');
    versionErr.name = 'VersionMismatch';
    dataProvider.update.mockRejectedValueOnce(versionErr);
    const handler = inviteHandler(true, 'Crn-Welcome');
    const event = getEventBridgeEventMock(user.id);

    await expect(handler(event)).rejects.toThrow(
      `Unable to save the code for the user with ID ${user.id}`,
    );
    expectUpdate(user, true);
  });

  test('version mismatch error when suppressConflict flag is false', async () => {
    const user = stubUser([]);
    dataProvider.fetchById.mockResolvedValueOnce(user);
    const versionErr = new Error('Version mismatch');
    versionErr.name = 'VersionMismatch';
    dataProvider.update.mockRejectedValueOnce(versionErr);
    const handler = inviteHandler(false, 'Crn-Welcome');
    const event = getEventBridgeEventMock(user.id);

    await expect(handler(event)).rejects.toThrow(
      `Unable to save the code for the user with ID ${user.id}`,
    );
    expectUpdate(user, false);
  });

  test('version mismatch error when suppressConflict flag is undefined', async () => {
    const user = stubUser([]);
    dataProvider.fetchById.mockResolvedValueOnce(user);
    const versionErr = new Error('Version mismatch');
    versionErr.name = 'VersionMismatch';
    dataProvider.update.mockRejectedValueOnce(versionErr);
    const handler = inviteHandler(undefined, 'Crn-Welcome');
    const event = getEventBridgeEventMock(user.id);

    await expect(handler(event)).rejects.toThrow(
      `Unable to save the code for the user with ID ${user.id}`,
    );
    expectUpdate(user, false);
  });
});

function createEvent(userId: string): UserInviteEventBridgeEvent {
  return {
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
      resourceId: userId,
      payload: {
        $type: 'EnrichedContentEvent',
        type: 'Published',
        id: userId,
        created: '2021-02-15T13:11:25Z',
        lastModified: '2021-02-15T13:11:25Z',
        version: 1,
        data: {},
      },
    },
  };
}

describe('sqsInviteHandlerFactory', () => {
  const origin = 'https://asap-hub.org';
  const sendEmailMock: jest.MockedFunction<SendEmail> = jest.fn();
  const dataProvider = {
    fetchById: jest.fn<Promise<UserDataObject | null>, [string]>(),
    update: jest.fn<Promise<void>, [string, any, any]>(),
  };

  const template: SendEmailTemplate = 'Crn-Welcome';

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('invokes inviteHandler for each record', async () => {
    // Prepare two event records
    const user1 = {
      id: 'u1',
      email: 'u1@example.com',
      firstName: 'User1',
      connections: [],
    } as UserDataObject;
    const user2 = {
      id: 'u2',
      email: 'u2@example.com',
      firstName: 'User2',
      connections: [],
    } as UserDataObject;

    dataProvider.fetchById
      .mockResolvedValueOnce(user1)
      .mockResolvedValueOnce(user2);
    dataProvider.update.mockResolvedValue();
    sendEmailMock.mockResolvedValue();

    const sqsHandler = sqsInviteHandlerFactory(
      sendEmailMock,
      dataProvider,
      origin,
      logger,
      false,
      template,
    );

    const event1 = createEvent('u1');
    const event2 = createEvent('u2');
    const sqsEvent: SQSEvent = {
      Records: [
        {
          messageId: '1',
          receiptHandle: 'rh1',
          body: JSON.stringify(event1),
          attributes: {},
          messageAttributes: {},
          md5OfBody: '',
          eventSource: '',
          eventSourceARN: '',
          awsRegion: '',
        },
        {
          messageId: '2',
          receiptHandle: 'rh2',
          body: JSON.stringify(event2),
          attributes: {},
          messageAttributes: {},
          md5OfBody: '',
          eventSource: '',
          eventSourceARN: '',
          awsRegion: '',
        },
      ],
    };

    await expect(sqsHandler(sqsEvent)).resolves.toBeUndefined();

    // Expect fetchById called for both users
    expect(dataProvider.fetchById).toHaveBeenCalledTimes(2);
    expect(dataProvider.fetchById).toHaveBeenNthCalledWith(1, 'u1');
    expect(dataProvider.fetchById).toHaveBeenNthCalledWith(2, 'u2');

    // Expect update called for both
    expect(dataProvider.update).toHaveBeenCalledTimes(2);

    // Expect sendEmail called for both
    expect(sendEmailMock).toHaveBeenCalledTimes(2);
  });

  test('propagates error if inviteHandler throws for any record', async () => {
    // First record succeeds, second fails
    const user1 = {
      id: 'u1',
      email: 'u1@example.com',
      firstName: 'User1',
      connections: [],
    } as UserDataObject;
    const user2 = {
      id: 'u2',
      email: 'u2@example.com',
      firstName: 'User2',
      connections: [],
    } as UserDataObject;

    dataProvider.fetchById
      .mockResolvedValueOnce(user1)
      .mockResolvedValueOnce(user2);
    dataProvider.update
      .mockResolvedValueOnce()
      .mockResolvedValueOnce();
    sendEmailMock
      .mockResolvedValueOnce()
      .mockRejectedValueOnce(new Error('send email error'));

    const sqsHandler = sqsInviteHandlerFactory(
      sendEmailMock,
      dataProvider,
      origin,
      logger,
      false,
      template,
    );

    const event1 = createEvent('u1');
    const event2 = createEvent('u2');
    const sqsEvent: SQSEvent = {
      Records: [
        {
          messageId: '1',
          receiptHandle: 'rh1',
          body: JSON.stringify(event1),
          attributes: {},
          messageAttributes: {},
          md5OfBody: '',
          eventSource: '',
          eventSourceARN: '',
          awsRegion: '',
        },
        {
          messageId: '2',
          receiptHandle: 'rh2',
          body: JSON.stringify(event2),
          attributes: {},
          messageAttributes: {},
          md5OfBody: '',
          eventSource: '',
          eventSourceARN: '',
          awsRegion: '',
        },
      ],
    };

    await expect(sqsHandler(sqsEvent)).rejects.toThrow(
      'Unable to send the email for the user with ID u2',
    );

    // Ensure first user was processed
    expect(dataProvider.fetchById).toHaveBeenNthCalledWith(1, 'u1');
    expect(sendEmailMock).toHaveBeenNthCalledWith(1, expect.any(Object));
    // Ensure second user attempt throws
    expect(dataProvider.fetchById).toHaveBeenNthCalledWith(2, 'u2');
    expect(sendEmailMock).toHaveBeenNthCalledWith(2, expect.any(Object));
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
