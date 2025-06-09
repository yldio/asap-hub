import { handler as forwardInviteEventsHandler } from '../../../src/handlers/user/forward-invite-handler';
import logger from '../../../src/utils/logger';

const mockSend = jest.fn();

jest.mock('@aws-sdk/client-sqs', () => {
  return {
    SQSClient: jest.fn().mockImplementation(() => ({
      send: mockSend,
    })),
    SendMessageCommand: jest.fn((args) => args),
  };
});

jest.mock('../../../src/config', () => ({
  inviteUserQueueUrl: 'https://sqs.example.com/queue',
  region: 'eu-west-1',
}));

jest.mock('../../../src/utils/logger', () => ({
  error: jest.fn(),
}));

describe('forward-invite-events handler', () => {
  beforeEach(() => {
    mockSend.mockReset();
    (logger.error as jest.Mock).mockReset();
  });

  const dummyEvent = {
    version: '1.0',
    id: 'id123',
    'detail-type': 'UsersPublished',
    source: 'contentful',
    account: 'acc123',
    time: new Date().toISOString(),
    region: 'eu-west-1',
    resources: [],
    detail: {
      id: 'user1',
      email: 'test@example.com',
    },
  };

  it('forwards event to SQS successfully', async () => {
    mockSend.mockResolvedValueOnce({ MessageId: 'msg123' });

    await expect(
      forwardInviteEventsHandler(dummyEvent as any, {} as any, {} as any),
    ).resolves.toBeUndefined();

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        QueueUrl: 'https://sqs.example.com/queue',
        MessageBody: JSON.stringify(dummyEvent),
      }),
    );
  });

  it('throws if inviteUserQueueUrl is missing', async () => {
    // Reset modules and remock config for this test
    jest.resetModules();
    jest.doMock('../../../src/config', () => ({
      inviteUserQueueUrl: undefined,
      region: 'eu-west-1',
    }));

    // Now re-import handler
    const { handler } = await import(
      '../../../src/handlers/user/forward-invite-handler'
    );

    await expect(
      handler(dummyEvent as any, {} as any, {} as any),
    ).rejects.toThrow('inviteUserQueueUrl is not set');
  });

  it('logs and rethrows if SQS send fails', async () => {
    const error = new Error('SQS error');
    mockSend.mockRejectedValueOnce(error);

    await expect(
      forwardInviteEventsHandler(dummyEvent as any, {} as any, {} as any),
    ).rejects.toThrow('SQS error');
    expect(logger.error).toHaveBeenCalledWith(
      error,
      'Failed to forward event to SQS',
    );
  });
});
