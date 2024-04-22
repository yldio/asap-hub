import {
  ListTeamProductivityResponse,
  ListUserProductivityResponse,
} from '@asap-hub/model';
import nock from 'nock';

import { API_BASE_URL } from '../../../config';
import {
  getTeamProductivity,
  getUserProductivity,
  ProductivityListOptions,
} from '../api';

jest.mock('../../../config');

afterEach(() => {
  nock.cleanAll();
});

const options: ProductivityListOptions = {
  pageSize: 10,
  currentPage: 0,
  timeRange: '30d',
};

const userProductivityResponse: ListUserProductivityResponse = {
  total: 1,
  items: [
    {
      id: '1',
      name: 'Test User',
      isAlumni: false,
      teams: [
        {
          team: 'Team A',
          isTeamInactive: false,
          isUserInactiveOnTeam: false,
          role: 'Collaborating PI',
        },
      ],
      asapOutput: 1,
      asapPublicOutput: 2,
      ratio: '0.50',
    },
  ],
};

describe('getUserProductivity', () => {
  it('makes an authorized GET request for analytics user productivity section', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/analytics/productivity/user')
      .query({ take: '10', skip: '0', filter: '30d' })
      .reply(200, {});

    await getUserProductivity(options, 'Bearer x');

    expect(nock.isDone()).toBe(true);
  });

  it('returns successfully fetched user productivity', async () => {
    nock(API_BASE_URL)
      .get('/analytics/productivity/user')
      .query({ take: '10', skip: '0', filter: '30d' })
      .reply(200, userProductivityResponse);
    expect(await getUserProductivity(options, '')).toEqual(
      userProductivityResponse,
    );
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL)
      .get('/analytics/productivity/user')
      .query({ take: '10', skip: '0', filter: '30d' })
      .reply(500);
    await expect(
      getUserProductivity(options, 'Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch analytics user productivity. Expected status 2xx. Received status 500."`,
    );
  });
});

const teamProductivityResponse: ListTeamProductivityResponse = {
  total: 1,
  items: [
    {
      id: '1',
      name: 'Test Team',
      isInactive: false,
      Article: 1,
      Bioinformatics: 2,
      Dataset: 3,
      'Lab Resource': 4,
      Protocol: 5,
    },
  ],
};

describe('getTeamProductivity', () => {
  it('makes an authorized GET request for analytics team productivity section', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/analytics/productivity/team')
      .query({ take: '10', skip: '0', filter: '30d' })
      .reply(200, {});

    await getTeamProductivity(options, 'Bearer x');

    expect(nock.isDone()).toBe(true);
  });

  it('returns successfully fetched team productivity', async () => {
    nock(API_BASE_URL)
      .get('/analytics/productivity/team')
      .query({ take: '10', skip: '0', filter: '30d' })
      .reply(200, teamProductivityResponse);
    expect(await getTeamProductivity(options, '')).toEqual(
      teamProductivityResponse,
    );
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL)
      .get('/analytics/productivity/team')
      .query({ take: '10', skip: '0', filter: '30d' })
      .reply(500);
    await expect(
      getTeamProductivity(options, 'Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch analytics team productivity. Expected status 2xx. Received status 500."`,
    );
  });
});
