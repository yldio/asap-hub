import {
  createListTutorialsResponse,
  createTutorialsResponse,
} from '@asap-hub/fixtures';
import nock from 'nock';
import { GetListOptions } from '@asap-hub/frontend-utils';
import { API_BASE_URL } from '../../../config';
import { getTutorialById, getTutorials } from '../api';

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

describe('getTutorials', () => {
  const options: GetListOptions = {
    filters: new Set(),
    pageSize: 10,
    currentPage: 0,
    searchQuery: '',
  };

  it('returns successfully fetched guides', async () => {
    const tutorials = createListTutorialsResponse(1);
    nock(API_BASE_URL)
      .get('/tutorials')
      .query({ take: '10', skip: '0' })
      .reply(200, tutorials);
    expect(await getTutorials(options, '')).toEqual(tutorials);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL)
      .get('/tutorials')
      .query({ take: '10', skip: '0' })
      .reply(500);

    await expect(
      getTutorials(options, ''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch tutorials. Expected status 2xx. Received status 500."`,
    );
  });
});
