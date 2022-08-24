import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from '@aws-sdk/client-cloudfront';
import { createHandler } from '../../../src/handlers/invalidate-cache/invalidate-handler';
const mockSend = jest.fn();

jest.mock('@aws-sdk/client-cloudfront', () => ({
  CloudFrontClient: jest.fn().mockImplementation(() => ({
    send: mockSend,
  })),
  CreateInvalidationCommand: jest
    .fn()
    .mockImplementation(() => ({ isMock: true })),
}));

describe('invalidate cache', () => {
  afterEach(() => jest.clearAllMocks());
  afterEach(() => jest.useRealTimers());

  test('invalidation is called on cloudfront', async () => {
    const dateReference = '2021-07-06T09:21:23.000Z';
    jest.useFakeTimers().setSystemTime(new Date(dateReference).getTime());

    const distributionId = 'fake-distribution-id';
    const event = {
      Records: [],
    };
    const handler = createHandler(distributionId);
    await handler(event);
    expect(CloudFrontClient).toHaveBeenCalledWith({
      apiVersion: '2020-05-31',
    });
    expect(CreateInvalidationCommand).toHaveBeenCalledWith({
      DistributionId: distributionId,
      InvalidationBatch: {
        CallerReference: dateReference,
        Paths: {
          Quantity: 1,
          Items: ['/index.html'],
        },
      },
    });
    expect(mockSend).toHaveBeenCalledWith({ isMock: true });
  });
});
