import nock from 'nock';
import { createPageResponse } from '@asap-hub/fixtures';
import { API_BASE_URL } from '../../config';
import { getPageByPath } from '../api';

jest.mock('../../config');

describe('getPageByPath', () => {
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });

  it('makes an non authorized GET request for the page id', async () => {
    nock(API_BASE_URL).get('/pages/1').reply(200, {});
    await getPageByPath('1');
    expect(nock.isDone()).toBe(true);
  });

  it('returns a successfully fetched page', async () => {
    const pageResponse = createPageResponse('1');
    nock(API_BASE_URL).get('/pages/1').reply(200, pageResponse);
    const result = await getPageByPath('1');
    expect(result).toEqual(pageResponse);
  });

  it('returns undefined for a 404', async () => {
    nock(API_BASE_URL).get('/pages/2').reply(404);
    expect(await getPageByPath('2')).toBe(undefined);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL).get('/pages/2').reply(500);

    await expect(getPageByPath('2')).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch page with path 2. Expected status 2xx or 404. Received status 500."`,
    );
  });
});
