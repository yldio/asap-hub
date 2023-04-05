import {
  createWorkingGroupListResponse,
  createWorkingGroupResponse,
} from '@asap-hub/fixtures';
import { GetListOptions } from '@asap-hub/frontend-utils';
import { ResearchOutputPostRequest } from '@asap-hub/model';
import nock from 'nock';
import { API_BASE_URL } from '../../../config';
import { CARD_VIEW_PAGE_SIZE } from '../../../hooks';
import { getWorkingGroup, getWorkingGroups } from '../api';
import { createResearchOutput } from '../../teams/api';

const options: GetListOptions = {
  filters: new Set(),
  pageSize: CARD_VIEW_PAGE_SIZE,
  currentPage: 0,
  searchQuery: '',
};

describe('getWorkingGroup', () => {
  it('makes an authorized GET request for the working group id', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/working-groups/42')
      .reply(200, {});
    await getWorkingGroup('42', 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns a successfully fetched working-group', async () => {
    const group = createWorkingGroupResponse({});
    nock(API_BASE_URL).get('/working-groups/42').reply(200, group);
    expect(await getWorkingGroup('42', '')).toEqual(group);
  });

  it('returns undefined for a 404', async () => {
    nock(API_BASE_URL).get('/working-groups/42').reply(404);
    expect(await getWorkingGroup('42', '')).toBe(undefined);
  });

  it('errors for another status', async () => {
    nock(API_BASE_URL).get('/working-groups/42').reply(500);
    await expect(
      getWorkingGroup('42', ''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch working group with id 42. Expected status 2xx or 404. Received status 500."`,
    );
  });
});

describe('getWorkingGroups', () => {
  it('makes an authorized GET request for working groups', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/working-groups')
      .query({ take: '10', skip: '0' })
      .reply(200, {});
    await getWorkingGroups(options, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns successfully fetched groups', async () => {
    const groups = createWorkingGroupListResponse(1);
    nock(API_BASE_URL)
      .get('/working-groups')
      .query({ take: '10', skip: '0' })
      .reply(200, groups);
    expect(await getWorkingGroups(options, '')).toEqual(groups);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL)
      .get('/working-groups')
      .query({ take: '10', skip: '0' })
      .reply(500);
    await expect(
      getWorkingGroups(options, ''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch working group list. Expected status 2xx. Received status 500."`,
    );
  });
});
describe('working group research output', () => {
  const payload: ResearchOutputPostRequest = {
    teams: ['90210'],
    documentType: 'Article',
    link: 'http://a-link',
    title: 'A title',
    asapFunded: false,
    usedInPublication: false,
    sharingStatus: 'Public',
    publishDate: undefined,
    description: '',
    descriptionMD: '',
    tags: [],
    type: 'Preprint',
    labs: ['lab1'],
    methods: [],
    organisms: [],
    environments: [],
    relatedResearch: [],
    authors: [{ userId: 'user-1' }],
    workingGroups: ['wg-1'],
  };
  it('makes an authorized POST request to create a research output', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .post('/research-outputs?publish=true', payload)
      .reply(201, { id: 123 });

    await createResearchOutput(payload, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('errors for an error status', async () => {
    nock(API_BASE_URL).post('/research-outputs?publish=true').reply(500, {});

    await expect(
      createResearchOutput(payload, 'Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to create research output for Working Group. Expected status 201. Received status 500."`,
    );
  });
});
