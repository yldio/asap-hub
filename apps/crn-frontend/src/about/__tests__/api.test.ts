import nock from 'nock';
import { createDiscoverResponse } from '@asap-hub/fixtures';
import { API_BASE_URL } from '../../config';
import { getDiscover } from '../api';

jest.mock('../../config');

describe('getDiscover', () => {
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });

  it('returns a successfully fetched discover', async () => {
    const discoverResponse = createDiscoverResponse();
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/discover')
      .reply(200, discoverResponse);

    const result = await getDiscover('Bearer x');
    expect(result).toEqual(discoverResponse);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/discover')
      .reply(500);

    await expect(
      getDiscover('Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch discover. Expected status 2xx. Received status 500."`,
    );
  });
});
