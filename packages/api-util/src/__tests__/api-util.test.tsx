import { createSentryHeaders } from '../api-util';

const mockSetTag = jest.fn();
jest.mock('@sentry/react', () => ({
  configureScope: jest.fn((callback) => callback({ setTag: mockSetTag })),
}));

describe('createSentryHeaders', () => {
  it('generates a header with a random string', () => {
    expect(createSentryHeaders()).toEqual({
      'X-Transaction-Id': expect.anything(),
    });
  });
  it('sets the conte a header with a random string', () => {
    const { 'X-Transaction-Id': transactionId } = createSentryHeaders();
    expect(mockSetTag).toHaveBeenLastCalledWith(
      'transaction_id',
      transactionId,
    );
  });
});
