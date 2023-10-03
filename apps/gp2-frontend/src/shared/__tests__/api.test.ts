import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';
import nock from 'nock';
import { API_BASE_URL } from '../../config';
import { getKeywords } from '../api';

jest.mock('../../config');

describe('getKeywords', () => {
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });
  it('returns a successfully fetched keywords list', async () => {
    const keywordsResponse: gp2Model.ListTagsResponse =
      gp2Fixtures.createTagsResponse();
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/tags')
      .reply(200, keywordsResponse);

    const result = await getKeywords('Bearer x');
    expect(result).toEqual(keywordsResponse);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/tags')
      .reply(500);

    await expect(
      getKeywords('Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch the Keywords. Expected status 2xx. Received status 500."`,
    );
  });
});
