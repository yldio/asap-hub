import nock from 'nock';
import {
  createTeamResponse,
  createListGroupResponse,
} from '@asap-hub/fixtures';
import { TeamResponse } from '@asap-hub/model';

import { API_BASE_URL } from '../../../config';
import { getTeam, patchTeam, getTeamGroups } from '../api';

jest.mock('../../../config');

afterEach(() => {
  nock.cleanAll();
});

describe('getTeam', () => {
  it('makes an authorized GET request for the team id', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/teams/42')
      .reply(200, {});
    await getTeam('42', 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns a successfully fetched team', async () => {
    const team = createTeamResponse();
    nock(API_BASE_URL).get('/teams/42').reply(200, team);
    expect(await getTeam('42', '')).toEqual(team);
  });

  it('returns undefined for a 404', async () => {
    nock(API_BASE_URL).get('/teams/42').reply(404);
    expect(await getTeam('42', '')).toBe(undefined);
  });

  it('errors for another status', async () => {
    nock(API_BASE_URL).get('/teams/42').reply(500);
    await expect(getTeam('42', '')).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch team with id 42. Expected status 2xx or 404. Received status 500."`,
    );
  });
});

describe('patchTeam', () => {
  const patch = {
    tools: [
      {
        url: 'https://example.com/tool',
        name: 'Example Tool',
        description: 'Example Tool',
      },
    ],
  };
  it('makes an authorized PATCH request for the team id', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .patch('/teams/42')
      .reply(200, {});

    await patchTeam('42', patch, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('passes the patch object in the body', async () => {
    nock(API_BASE_URL).patch('/teams/42', patch).reply(200, {});

    await patchTeam('42', patch, '');
    expect(nock.isDone()).toBe(true);
  });

  it('returns a successfully updated team', async () => {
    const updated: Partial<TeamResponse> = {
      projectTitle: 'Team Project',
      tools: patch.tools,
    };
    nock(API_BASE_URL).patch('/teams/42', patch).reply(200, updated);

    expect(await patchTeam('42', patch, '')).toEqual(updated);
  });

  it('errors for an error status', async () => {
    nock(API_BASE_URL).patch('/teams/42', patch).reply(500, {});

    await expect(
      patchTeam('42', patch, ''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to update team with id 42. Expected status 2xx. Received status 500."`,
    );
  });
});

describe('getTeamGroups', () => {
  it('makes an authorized GET request for the team id', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/teams/42/groups')
      .reply(200, {});
    await getTeamGroups('42', 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns successfully fetched team groups', async () => {
    const groups = createListGroupResponse(0);
    nock(API_BASE_URL).get('/teams/42/groups').reply(200, groups);
    expect(await getTeamGroups('42', '')).toEqual(groups);
  });
  it('errors for an error status', async () => {
    nock(API_BASE_URL).get('/teams/42/groups').reply(500);
    await expect(
      getTeamGroups('42', ''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch team groups with id 42. Expected status 2xx. Received status 500."`,
    );
  });
});
