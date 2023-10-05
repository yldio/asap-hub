import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';
import nock from 'nock';
import { API_BASE_URL } from '../../config';
import { getTags } from '../api';

jest.mock('../../config');

describe('getTags', () => {
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });
  it('returns a successfully fetched tags list', async () => {
    const tagsResponse: gp2Model.ListTagsResponse =
      gp2Fixtures.createTagsResponse();
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/tags')
      .reply(200, tagsResponse);

    const result = await getTags('Bearer x');
    expect(result).toEqual(tagsResponse);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/tags')
      .reply(500);

    await expect(
      getTags('Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch the Tags. Expected status 2xx. Received status 500."`,
    );
  });
});
