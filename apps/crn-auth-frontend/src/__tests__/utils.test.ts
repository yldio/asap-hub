import { mockLocation } from '@asap-hub/dom-test-utils';

import { getHubUrlFromRedirect } from '../utils';

const { mockGetLocation } = mockLocation();

it('to get origin from redirect URI', () => {
  mockGetLocation.mockReturnValue(
    new URL(
      `?redirect_uri=${encodeURIComponent('http://google.com/page')}`,
      mockGetLocation(),
    ),
  );
  expect(getHubUrlFromRedirect()).toEqual('http://google.com');
});

it('to throw if redirect URI not present', () => {
  mockGetLocation.mockReturnValue(new URL('', mockGetLocation()));
  expect(getHubUrlFromRedirect).toThrowErrorMatchingInlineSnapshot(
    `"Redirect uri must be provided"`,
  );
});
