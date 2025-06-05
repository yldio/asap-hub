import { EventBridgeEvent, SQSEvent } from 'aws-lambda';
import { UserDataProvider } from '../../../src/data-providers/types';
import { UserDataObject } from '@asap-hub/model';

describe('handler (EventBridge)', () => {
  const userId = 'user-123';
  const userRecord: UserDataObject = {
    id: userId,
    email: 'user@example.com',
    firstName: 'Alice',
    connections: [],
  } as unknown as UserDataObject;

  const baseEvent = {
    id: 'evt-1',
    version: '1',
    account: 'acc-1',
    time: '2021-01-01T00:00:00Z',
    region: 'us-east-1',
    resources: [],
    source: 'source',
    'detail-type': 'UsersPublished',
    detail: {
      resourceId: userId,
      payload: {
        $type: '',
        type: '',
        id: userId,
        created: '',
        lastModified: '',
        version: 1,
        data: {},
      },
    },
  } as unknown as EventBridgeEvent<
    'UsersPublished',
    { resourceId: string; payload: any }
  >;

  let fetchByIdMock: jest.Mock<Promise<UserDataObject | null>, [string]>;
  let updateMock: jest.Mock<Promise<void>, [string, any, any]>;
  let sendEmailMock: jest.Mock<Promise<void>, [any]>;
  let handler: (
    event: EventBridgeEvent<
      'UsersPublished',
      { resourceId: string; payload: any }
    >,
    context: any,
    callback: any,
  ) => Promise<void>;

  beforeEach(() => {
    fetchByIdMock = jest.fn();
    updateMock = jest.fn();
    sendEmailMock = jest.fn();

    jest.doMock('../../../src/dependencies/users.dependencies', () => ({
      getUserDataProvider: () =>
        ({
          fetchById: fetchByIdMock,
          update: updateMock,
        }) as Partial<UserDataProvider> as UserDataProvider,
    }));

    jest.doMock('../../../src/utils/send-email', () => ({
      sendEmailFactory: () => sendEmailMock,
    }));

    jest.doMock('../../../src/utils/logger', () => ({
      debug: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
    }));

    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = require('../../../src/handlers/user/invite-handler');
      handler = mod.handler;
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  test('throws if fetchById returns null', async () => {
    fetchByIdMock.mockResolvedValueOnce(null);

    await expect(handler(baseEvent, {} as any, () => {})).rejects.toThrow(
      `Unable to find a user with ID ${userId}`,
    );
    expect(fetchByIdMock).toHaveBeenCalledWith(userId);
  });

  test('updates and sends email for a fresh user', async () => {
    fetchByIdMock.mockResolvedValueOnce(userRecord);
    updateMock.mockResolvedValueOnce(undefined);
    sendEmailMock.mockResolvedValueOnce(undefined);

    await expect(
      handler(baseEvent, {} as any, () => {}),
    ).resolves.toBeUndefined();

    expect(fetchByIdMock).toHaveBeenCalledWith(userId);
    expect(updateMock).toHaveBeenCalledTimes(1);
    expect(sendEmailMock).toHaveBeenCalledTimes(1);
  });
});

describe('sqsHandler (SQS)', () => {
  const userId = 'user-456';
  const userRecord: UserDataObject = {
    id: userId,
    email: 'user2@example.com',
    firstName: 'Bob',
    connections: [],
  } as unknown as UserDataObject;

  let fetchByIdMock: jest.Mock<Promise<UserDataObject | null>, [string]>;
  let updateMock: jest.Mock<Promise<void>, [string, any, any]>;
  let sendEmailMock: jest.Mock<Promise<void>, [any]>;
  let sqsHandler: (
    event: SQSEvent,
    context: any,
    callback: any,
  ) => Promise<void>;

  beforeEach(() => {
    fetchByIdMock = jest.fn();
    updateMock = jest.fn();
    sendEmailMock = jest.fn();

    jest.doMock('../../../src/dependencies/users.dependencies', () => ({
      getUserDataProvider: () =>
        ({
          fetchById: fetchByIdMock,
          update: updateMock,
        }) as Partial<UserDataProvider> as UserDataProvider,
    }));

    jest.doMock('../../../src/utils/send-email', () => ({
      sendEmailFactory: () => sendEmailMock,
    }));

    jest.doMock('../../../src/utils/logger', () => ({
      debug: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
    }));

    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = require('../../../src/handlers/user/invite-handler');
      sqsHandler = mod.sqsHandler;
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  test('processes multiple SQS records successfully', async () => {
    fetchByIdMock
      .mockResolvedValueOnce(userRecord)
      .mockResolvedValueOnce(userRecord);
    updateMock.mockResolvedValue(undefined);
    sendEmailMock.mockResolvedValue(undefined);

    const ebEvent1 = {
      id: 'evt-1',
      version: '1',
      account: 'acc',
      time: '2021-01-01T00:00:00Z',
      region: 'us-east-1',
      resources: [],
      source: 'source',
      'detail-type': 'UsersPublished',
      detail: {
        resourceId: userId,
        payload: {
          $type: '',
          type: '',
          id: userId,
          created: '',
          lastModified: '',
          version: 1,
          data: {},
        },
      },
    } as unknown as EventBridgeEvent<
      'UsersPublished',
      { resourceId: string; payload: any }
    >;

    const ebEvent2 = { ...ebEvent1, id: 'evt-2' };

    const commonAttrs = {
      ApproximateReceiveCount: '1',
      SentTimestamp: '',
      SenderId: '',
      ApproximateFirstReceiveTimestamp: '',
    };

    const sqsEvent = {
      Records: [
        {
          messageId: '1',
          receiptHandle: 'rh1',
          body: JSON.stringify(ebEvent1),
          attributes: commonAttrs,
          messageAttributes: {},
          md5OfBody: '',
          eventSource: '',
          eventSourceARN: '',
          awsRegion: '',
        },
        {
          messageId: '2',
          receiptHandle: 'rh2',
          body: JSON.stringify(ebEvent2),
          attributes: commonAttrs,
          messageAttributes: {},
          md5OfBody: '',
          eventSource: '',
          eventSourceARN: '',
          awsRegion: '',
        },
      ],
    } as unknown as SQSEvent;

    await expect(
      sqsHandler(sqsEvent, {} as any, () => {}),
    ).resolves.toBeUndefined();

    expect(fetchByIdMock).toHaveBeenCalledTimes(2);
    expect(fetchByIdMock).toHaveBeenNthCalledWith(1, userId);
    expect(fetchByIdMock).toHaveBeenNthCalledWith(2, userId);

    expect(updateMock).toHaveBeenCalledTimes(2);
    expect(sendEmailMock).toHaveBeenCalledTimes(2);
  });

  test('propagates error when second record fails in sendEmail', async () => {
    fetchByIdMock
      .mockResolvedValueOnce(userRecord)
      .mockResolvedValueOnce(userRecord);
    updateMock
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(undefined);
    sendEmailMock
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('Email failure'));

    const ebEvent1 = {
      id: 'evt-1',
      version: '1',
      account: 'acc',
      time: '2021-01-01T00:00:00Z',
      region: 'us-east-1',
      resources: [],
      source: 'source',
      'detail-type': 'UsersPublished',
      detail: {
        resourceId: userId,
        payload: {
          $type: '',
          type: '',
          id: userId,
          created: '',
          lastModified: '',
          version: 1,
          data: {},
        },
      },
    } as unknown as EventBridgeEvent<
      'UsersPublished',
      { resourceId: string; payload: any }
    >;
    const ebEvent2 = { ...ebEvent1, id: 'evt-2' };

    const commonAttrs = {
      ApproximateReceiveCount: '1',
      SentTimestamp: '',
      SenderId: '',
      ApproximateFirstReceiveTimestamp: '',
    };

    const sqsEvent = {
      Records: [
        {
          messageId: '1',
          receiptHandle: 'rh1',
          body: JSON.stringify(ebEvent1),
          attributes: commonAttrs,
          messageAttributes: {},
          md5OfBody: '',
          eventSource: '',
          eventSourceARN: '',
          awsRegion: '',
        },
        {
          messageId: '2',
          receiptHandle: 'rh2',
          body: JSON.stringify(ebEvent2),
          attributes: commonAttrs,
          messageAttributes: {},
          md5OfBody: '',
          eventSource: '',
          eventSourceARN: '',
          awsRegion: '',
        },
      ],
    } as unknown as SQSEvent;

    await expect(sqsHandler(sqsEvent, {} as any, () => {})).rejects.toThrow(
      `Unable to send the email for the user with ID ${userId}`,
    );

    expect(fetchByIdMock).toHaveBeenNthCalledWith(1, userId);
    expect(sendEmailMock).toHaveBeenNthCalledWith(1, expect.any(Object));
    expect(fetchByIdMock).toHaveBeenNthCalledWith(2, userId);
    expect(sendEmailMock).toHaveBeenNthCalledWith(2, expect.any(Object));
  });
});
