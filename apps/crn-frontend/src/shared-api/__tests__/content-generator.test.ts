import nock from 'nock';
import { API_BASE_URL } from '../../config';

import { getGeneratedShortDescription } from '../content-generator';

describe('getGeneratedShortDescription', () => {
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });

  it('returns a successfully fetched short description', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .post(`/generate-content`, {
        description: 'A very long description',
      })
      .reply(200, { shortDescription: 'A short description' });

    const result = await getGeneratedShortDescription(
      'A very long description',
      'Bearer x',
    );
    expect(result).toEqual({ shortDescription: 'A short description' });
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .post(`/generate-content`, {
        description: 'test',
      })
      .reply(500, {});

    await expect(
      getGeneratedShortDescription('test', 'Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to generate content for research output. Expected status 200. Received status 500."`,
    );
  });
});
