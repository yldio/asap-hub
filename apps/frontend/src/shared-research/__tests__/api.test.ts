import nock from 'nock';

import {
  createListResearchOutputResponse,
  createResearchOutputResponse,
} from '@asap-hub/fixtures';

import { getResearchOutput, getResearchOutputsLegacy } from '../api';
import { API_BASE_URL } from '../../config';
import { GetListOptions } from '../../api-util';
import { CARD_VIEW_PAGE_SIZE } from '../../hooks';

jest.mock('../../config');

afterEach(() => {
  nock.cleanAll();
});

const options: GetListOptions = {
  filters: new Set(),
  pageSize: CARD_VIEW_PAGE_SIZE,
  currentPage: 0,
  searchQuery: '',
};

describe('getResearchOutputsLegacy', () => {
  it('makes an authorized GET request for research outputs', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/research-outputs')
      .query({ take: '10', skip: '0' })
      .reply(200, {});
    await getResearchOutputsLegacy(options, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns successfully fetched research outputs', async () => {
    const users = createListResearchOutputResponse(1);
    nock(API_BASE_URL)
      .get('/research-outputs')
      .query({ take: '10', skip: '0' })
      .reply(200, users);
    expect(await getResearchOutputsLegacy(options, '')).toEqual(users);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL)
      .get('/research-outputs')
      .query({ take: '10', skip: '0' })
      .reply(500);
    await expect(
      getResearchOutputsLegacy(options, ''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch research output list. Expected status 2xx. Received status 500."`,
    );
  });
});

describe('getResearchOutput', () => {
  it('makes an authorized GET request for the research output id', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/research-outputs/42')
      .reply(200, {});
    await getResearchOutput('42', 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns a successfully fetched research output', async () => {
    const researchOutput = createResearchOutputResponse();
    nock(API_BASE_URL).get('/research-outputs/42').reply(200, researchOutput);
    expect(await getResearchOutput('42', '')).toEqual(researchOutput);
  });

  it('returns undefined for a 404', async () => {
    nock(API_BASE_URL).get('/research-outputs/42').reply(404);
    expect(await getResearchOutput('42', '')).toBe(undefined);
  });

  it('errors for another status', async () => {
    nock(API_BASE_URL).get('/research-outputs/42').reply(500);
    await expect(
      getResearchOutput('42', ''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch research output with id 42. Expected status 2xx or 404. Received status 500."`,
    );
  });
});
