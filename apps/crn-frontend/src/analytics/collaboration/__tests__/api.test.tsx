import {
  ListTeamCollaborationResponse,
  ListUserCollaborationResponse,
} from '@asap-hub/model';
import nock from 'nock';

import { API_BASE_URL } from '../../../config';
import {
  getUserCollaboration,
  CollaborationListOptions,
  getTeamCollaboration,
} from '../api';

jest.mock('../../../config');

afterEach(() => {
  nock.cleanAll();
});

const options: CollaborationListOptions = {
  pageSize: 10,
  currentPage: 0,
  timeRange: '30d',
};

const userCollaborationResponse: ListUserCollaborationResponse = {
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
          role: 'Collaborating PI',
          outputsCoAuthoredAcrossTeams: 1,
          outputsCoAuthoredWithinTeam: 2,
        },
      ],
    },
  ],
};

const teamCollaborationResponse: ListTeamCollaborationResponse = {
  total: 1,
  items: [
    {
      id: '1',
      name: 'Test User',
      isInactive: false,
      outputsCoProducedWithin: {
        Article: 1,
        Bioinformatics: 0,
        Dataset: 0,
        'Lab Resource': 0,
        Protocol: 1,
      },
      outputsCoProducedAcross: {
        byDocumentType: {
          Article: 1,
          Bioinformatics: 0,
          Dataset: 0,
          'Lab Resource': 0,
          Protocol: 1,
        },
        byTeam: [
          {
            id: '1',
            name: 'Test Team',
            isInactive: false,
            Article: 1,
            Bioinformatics: 0,
            Dataset: 0,
            'Lab Resource': 0,
            Protocol: 1,
          },
        ],
      },
    },
  ],
};

describe('getUserCollaboration', () => {
  it('makes an authorized GET request for analytics user collaboration section', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/analytics/collaboration/user')
      .query({ take: '10', skip: '0', filter: '30d' })
      .reply(200, {});

    await getUserCollaboration(options, 'Bearer x');

    expect(nock.isDone()).toBe(true);
  });

  it('returns successfully fetched user productivity', async () => {
    nock(API_BASE_URL)
      .get('/analytics/collaboration/user')
      .query({ take: '10', skip: '0', filter: '30d' })
      .reply(200, userCollaborationResponse);
    expect(await getUserCollaboration(options, '')).toEqual(
      userCollaborationResponse,
    );
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL)
      .get('/analytics/collaboration/user')
      .query({ take: '10', skip: '0', filter: '30d' })
      .reply(500);
    await expect(
      getUserCollaboration(options, 'Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch analytics user collaboration. Expected status 2xx. Received status 500."`,
    );
  });
});

describe('getTeamCollaboration', () => {
  it('makes an authorized GET request for analytics team collaboration section', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/analytics/collaboration/team')
      .query({ take: '10', skip: '0', filter: '30d' })
      .reply(200, {});

    await getTeamCollaboration(options, 'Bearer x');

    expect(nock.isDone()).toBe(true);
  });

  it('returns successfully fetched team collaboration data', async () => {
    nock(API_BASE_URL)
      .get('/analytics/collaboration/team')
      .query({ take: '10', skip: '0', filter: '30d' })
      .reply(200, teamCollaborationResponse);
    expect(await getTeamCollaboration(options, '')).toEqual(
      teamCollaborationResponse,
    );
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL)
      .get('/analytics/collaboration/team')
      .query({ take: '10', skip: '0', filter: '30d' })
      .reply(500);
    await expect(
      getTeamCollaboration(options, 'Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch analytics team collaboration. Expected status 2xx. Received status 500."`,
    );
  });
});
