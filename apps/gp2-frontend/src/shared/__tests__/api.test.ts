import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';
import nock from 'nock';
import { API_BASE_URL } from '../../config';
import { getTags, getContributingCohorts } from '../api';

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

describe('getContributingCohorts', () => {
  const validResponse: gp2Model.ListContributingCohortResponse = {
    total: 2,
    items: [
      { id: '7', name: 'S3' },
      { id: '11', name: 'CALYPSO' },
    ],
  };
  it('returns successfully fetched cohorts', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/contributing-cohorts')
      .reply(200, validResponse);

    const result = await getContributingCohorts('Bearer x');
    expect(result).toEqual(validResponse.items);
    expect(nock.isDone()).toBe(true);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/contributing-cohorts')
      .reply(500);

    await expect(
      getContributingCohorts('Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch contributing cohorts. Expected status 2xx. Received status 500."`,
    );
  });
});
