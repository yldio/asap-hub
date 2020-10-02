import { getHubUrlFromRedirect } from '../utils';

const originalLocation = globalThis.location;
const mockLocation = jest.fn();
beforeEach(() => {
  mockLocation.mockReset().mockReturnValue(new URL('http://localhost/test'));
  delete globalThis.location;
  Object.defineProperty(globalThis, 'location', {
    configurable: true,
    enumerable: true,
    get: mockLocation,
  });
});
afterEach(() => {
  Object.defineProperty(globalThis, 'location', {
    configurable: true,
    enumerable: true,
    value: originalLocation,
  });
});
it('to get origin from redirect URI', () => {
  mockLocation.mockReturnValue(
    new URL(
      `?redirect_uri=${encodeURIComponent('http://google.com')}`,
      mockLocation(),
    ),
  );
  expect(getHubUrlFromRedirect()).toEqual('http://google.com');
});

it('to throw if redirect URI not present', () => {
  mockLocation.mockReturnValue(new URL('', mockLocation()));
  expect(getHubUrlFromRedirect).toThrowErrorMatchingInlineSnapshot(
    `"Redirect uri must be provided"`,
  );
});
