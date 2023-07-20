import nock from 'nock';
import { createListGuidesResponse } from '@asap-hub/fixtures';
import { API_BASE_URL } from '../../config';
import { getGuides } from '../api';

jest.mock('../../config');

describe('getGuides', () => {
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });

  it('returns successfully fetched guides', async () => {
    const guideResponse = createListGuidesResponse();
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/guides/Home')
      .reply(200, guideResponse);

    const result = await getGuides('Bearer x', 'Home');
    expect(result).toEqual(guideResponse);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/guides/Home')
      .reply(500);

    await expect(
      getGuides('Bearer x', 'Home'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch guides. Expected status 2xx. Received status 500."`,
    );
  });
});
