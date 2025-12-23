import { EventBridgeEvent } from 'aws-lambda';
import { forwardInviteEventToQueue } from '../../../src/handlers/user';
import { UserPayload } from '../../../src';

// Mock SQSClient
const mockSend = jest.fn();
jest.mock('@aws-sdk/client-sqs', () => ({
  SQSClient: jest.fn().mockImplementation(() => ({
    send: mockSend,
  })),
  SendMessageCommand: jest.fn((input) => input),
}));

describe('forwardInviteEventToQueue', () => {
  beforeEach(() => {
    mockSend.mockReset();
  });

  const event: EventBridgeEvent<'UsersPublished', UserPayload> = {
    version: '1',
    id: 'evt-id',
    'detail-type': 'UsersPublished',
    source: 'source',
    account: 'account',
    time: new Date().toISOString(),
    region: 'eu-west-1',
    resources: [],
    detail: {
      resourceId: 'abc123' /* ... other UserPayload fields ... */,
    } as UserPayload,
  };

  it('forwards event to SQS successfully', async () => {
    mockSend.mockResolvedValueOnce({ MessageId: 'msg-123' });

    await expect(
      forwardInviteEventToQueue({
        event,
        queueUrl: 'https://sqs.url/queue',
        region: 'eu-west-1',
      }),
    ).resolves.toBeUndefined();

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        QueueUrl: 'https://sqs.url/queue',
        MessageBody: JSON.stringify(event),
      }),
    );
  });

  it('throws if queueUrl is missing', async () => {
    await expect(
      forwardInviteEventToQueue({
        event,
        queueUrl: '', // Missing URL
        region: 'eu-west-1',
      }),
    ).rejects.toThrow('inviteUserQueueUrl is not set');
  });

  it('rethrows if SQS fails', async () => {
    mockSend.mockRejectedValueOnce(new Error('SQS error'));

    await expect(
      forwardInviteEventToQueue({
        event,
        queueUrl: 'https://sqs.url/queue',
        region: 'eu-west-1',
      }),
    ).rejects.toThrow('SQS error');
  });
});
