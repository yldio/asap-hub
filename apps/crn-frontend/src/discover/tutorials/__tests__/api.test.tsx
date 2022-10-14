import { createTutorialsResponse } from '@asap-hub/fixtures';
import nock from 'nock';
import { API_BASE_URL } from '../../../config';
import { getTutorialById } from '../api';

jest.mock('../../../config');

afterEach(() => {
  nock.cleanAll();
});

describe('getTutorialById', () => {
  it('makes an authorized GET request for the tutorial', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/tutorials/42')
      .reply(200, {});
    await getTutorialById('42', 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns a successfully fetched tutorial', async () => {
    const tutorial = createTutorialsResponse({ key: '42' });
    nock(API_BASE_URL).get('/tutorials/42').reply(200, tutorial);
    expect(await getTutorialById('42', '')).toEqual(tutorial);
  });

  it('returns undefined for a 404', async () => {
    nock(API_BASE_URL).get('/tutorials/42').reply(404);
    expect(await getTutorialById('42', '')).toBe(undefined);
  });

  it('errors for another status', async () => {
    nock(API_BASE_URL).get('/tutorials/42').reply(500);
    await expect(
      getTutorialById('42', ''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch tutorial with id 42. Expected status 2xx or 404. Received status 500."`,
    );
  });
});
