import { createHandler } from '../../../src/handlers/invalidate-cache/index-handler';
const mockCreateInvalidation = jest.fn();

jest.mock('aws-sdk', () => ({
  CloudFront: jest.fn(() => ({
    createInvalidation: jest.fn((options) => ({
      promise: () => mockCreateInvalidation(options),
    })),
  })),
}));

describe('invalidate cache', () => {
  afterEach(() => jest.clearAllMocks());
  afterEach(() => jest.useRealTimers());

  test('invalidation is called on cloudfront', async () => {
    const dateReference = '2021-07-06T09:21:23.000Z';
    jest
      .useFakeTimers('modern')
      .setSystemTime(new Date(dateReference).getTime());

    const distributionId = 'fake-distribution-id';
    const event = {
      Records: [],
    };
    const handler = createHandler(distributionId);
    await handler(event);
    expect(mockCreateInvalidation).toHaveBeenCalledWith({
      DistributionId: distributionId,
      InvalidationBatch: {
        CallerReference: dateReference,
        Paths: {
          Quantity: 1,
          Items: ['/index.html'],
        },
      },
    });
  });
});
