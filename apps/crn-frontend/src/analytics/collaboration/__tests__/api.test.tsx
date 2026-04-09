import {
  teamCollaborationPerformance,
  teamCollaborationResponse,
  userCollaborationPerformance,
  userCollaborationResponse,
  preliminaryDataSharingResponse,
} from '@asap-hub/fixtures';
import {
  PreliminaryDataSharingDataObject,
  SortTeamCollaboration,
  SortUserCollaboration,
  TeamCollaborationPerformance,
  TeamCollaborationResponse,
  UserCollaborationResponse,
  UserCollaborationPerformance,
} from '@asap-hub/model';
import { AnalyticsSearchOptionsWithFiltering } from '../../utils/analytics-options';
import { OpensearchClient } from '../../utils/opensearch';

import {
  getTeamCollaboration,
  getTeamCollaborationPerformance,
  getUserCollaboration,
  getUserCollaborationPerformance,
  getPreliminaryDataSharing,
} from '../api';

jest.mock('../../../config');

const defaultUserOptions: AnalyticsSearchOptionsWithFiltering<SortUserCollaboration> =
  {
    pageSize: 10,
    currentPage: 0,
    timeRange: '30d',
    tags: [],
    sort: 'user_asc',
  };

const defaultTeamOptions: AnalyticsSearchOptionsWithFiltering<SortTeamCollaboration> =
  {
    pageSize: 10,
    currentPage: 0,
    timeRange: '30d',
    tags: [],
    sort: 'team_asc',
  };

describe('getUserCollaboration', () => {
  let opensearchClient: OpensearchClient<UserCollaborationResponse>;
  let searchSpy: jest.SpyInstance;

  beforeEach(() => {
    opensearchClient = new OpensearchClient(
      'user-collaboration',
      'Bearer test-token',
    );
    searchSpy = jest.spyOn(opensearchClient, 'search').mockResolvedValue({
      items: userCollaborationResponse.items,
      total: userCollaborationResponse.total,
    });
  });

  afterEach(() => {
    searchSpy.mockRestore();
  });

  it('calls opensearch client with correct parameters', async () => {
    await getUserCollaboration(opensearchClient, defaultUserOptions);

    expect(searchSpy).toHaveBeenCalledWith({
      searchTags: [],
      currentPage: 0,
      pageSize: 10,
      timeRange: '30d',
      searchScope: 'extended',
      sort: expect.any(Array),
    });
  });

  it('applies user_asc sort correctly', async () => {
    await getUserCollaboration(opensearchClient, {
      ...defaultUserOptions,
      sort: 'user_asc',
    });

    expect(searchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        sort: [
          {
            _script: {
              type: 'string',
              script: {
                source: "doc['name.keyword'].value.toLowerCase()",
                lang: 'painless',
              },
              order: 'asc',
            },
          },
        ],
      }),
    );
  });

  it('applies team_asc sort with nested path', async () => {
    await getUserCollaboration(opensearchClient, {
      ...defaultUserOptions,
      sort: 'team_asc',
    });

    expect(searchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        sort: [
          {
            _script: {
              type: 'string',
              script: {
                source: "doc['teams.team.keyword'].value.toLowerCase()",
                lang: 'painless',
              },
              order: 'asc',
              nested: { path: 'teams' },
            },
          },
        ],
      }),
    );
  });

  it('applies outputs_coauthored_within_desc sort correctly', async () => {
    await getUserCollaboration(opensearchClient, {
      ...defaultUserOptions,
      sort: 'outputs_coauthored_within_desc',
    });

    expect(searchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        sort: [
          {
            totalUniqueOutputsCoAuthoredWithinTeam: {
              order: 'desc',
            },
          },
        ],
      }),
    );
  });
});

describe('getTeamCollaboration', () => {
  let opensearchClient: OpensearchClient<TeamCollaborationResponse>;
  let searchSpy: jest.SpyInstance;

  beforeEach(() => {
    opensearchClient = new OpensearchClient(
      'team-collaboration',
      'Bearer test-token',
    );
    searchSpy = jest.spyOn(opensearchClient, 'search').mockResolvedValue({
      items: teamCollaborationResponse.items,
      total: teamCollaborationResponse.total,
    });
  });

  afterEach(() => {
    searchSpy.mockRestore();
  });

  it('calls opensearch client with correct parameters', async () => {
    await getTeamCollaboration(opensearchClient, defaultTeamOptions);

    expect(searchSpy).toHaveBeenCalledWith({
      searchTags: [],
      currentPage: 0,
      pageSize: 10,
      timeRange: '30d',
      searchScope: 'flat',
      sort: expect.any(Array),
    });
  });

  it('applies team_asc sort correctly', async () => {
    await getTeamCollaboration(opensearchClient, {
      ...defaultTeamOptions,
      sort: 'team_asc',
    });

    expect(searchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        sort: [
          {
            _script: {
              type: 'string',
              script: {
                source: "doc['name.keyword'].value.toLowerCase()",
                lang: 'painless',
              },
              order: 'asc',
            },
          },
        ],
      }),
    );
  });

  it('applies article_asc sort correctly', async () => {
    await getTeamCollaboration(opensearchClient, {
      ...defaultTeamOptions,
      sort: 'article_asc',
    });

    expect(searchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        sort: [
          {
            'outputsCoProducedWithin.Article': {
              order: 'asc',
            },
          },
        ],
      }),
    );
  });

  it('applies article_across_asc sort correctly', async () => {
    await getTeamCollaboration(opensearchClient, {
      ...defaultTeamOptions,
      sort: 'article_across_asc',
    });

    expect(searchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        sort: [
          {
            'outputsCoProducedAcross.byDocumentType.Article': {
              order: 'asc',
            },
          },
        ],
      }),
    );
  });

  it('passes outputType to opensearch client', async () => {
    await getTeamCollaboration(opensearchClient, {
      ...defaultTeamOptions,
      outputType: 'public',
    });

    expect(searchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        outputType: 'public',
      }),
    );
  });
});

describe('getUserCollaborationPerformance', () => {
  let opensearchClient: OpensearchClient<UserCollaborationPerformance>;
  let searchSpy: jest.SpyInstance;

  beforeEach(() => {
    opensearchClient = new OpensearchClient(
      'user-collaboration-performance',
      'Bearer test-token',
    );
    searchSpy = jest.spyOn(opensearchClient, 'search').mockResolvedValue({
      items: [userCollaborationPerformance],
      total: 1,
    });
  });

  afterEach(() => {
    searchSpy.mockRestore();
  });

  it('calls opensearch client with correct parameters', async () => {
    await getUserCollaborationPerformance(opensearchClient, {
      timeRange: '30d',
      documentCategory: 'all',
    });

    expect(searchSpy).toHaveBeenCalledWith({
      searchTags: [],
      timeRange: '30d',
      searchScope: 'flat',
      sort: [],
      documentCategory: 'all',
    });
  });

  it('returns the first item from opensearch results', async () => {
    const result = await getUserCollaborationPerformance(opensearchClient, {
      timeRange: '30d',
      documentCategory: 'all',
    });

    expect(result).toEqual(userCollaborationPerformance);
  });
});

describe('getTeamCollaborationPerformance', () => {
  let opensearchClient: OpensearchClient<TeamCollaborationPerformance>;
  let searchSpy: jest.SpyInstance;

  beforeEach(() => {
    opensearchClient = new OpensearchClient(
      'team-collaboration-performance',
      'Bearer test-token',
    );
    searchSpy = jest.spyOn(opensearchClient, 'search').mockResolvedValue({
      items: [teamCollaborationPerformance],
      total: 1,
    });
  });

  afterEach(() => {
    searchSpy.mockRestore();
  });

  it('calls opensearch client with correct parameters', async () => {
    await getTeamCollaborationPerformance(opensearchClient, {
      timeRange: '30d',
      outputType: 'all',
    });

    expect(searchSpy).toHaveBeenCalledWith({
      searchTags: [],
      timeRange: '30d',
      searchScope: 'flat',
      sort: [],
      outputType: 'all',
    });
  });

  it('returns the first item from opensearch results', async () => {
    const result = await getTeamCollaborationPerformance(opensearchClient, {
      timeRange: '30d',
      outputType: 'all',
    });

    expect(result).toEqual(teamCollaborationPerformance);
  });
});

describe('getPreliminaryDataSharing', () => {
  const mockSearch = jest.fn();
  const opensearchClient = {
    search: mockSearch,
  } as unknown as OpensearchClient<PreliminaryDataSharingDataObject>;

  beforeEach(() => {
    mockSearch.mockReset();
    mockSearch.mockResolvedValue(preliminaryDataSharingResponse);
  });

  it('returns successfully fetched preliminary data sharing', async () => {
    await getPreliminaryDataSharing(opensearchClient, {
      currentPage: 0,
      pageSize: 10,
      tags: [],
      timeRange: 'all',
    });

    expect(mockSearch).toHaveBeenCalledWith({
      searchTags: [],
      currentPage: 0,
      pageSize: 10,
      timeRange: 'all',
      searchScope: 'flat',
    });
  });

  it('applies percent_shared_asc sort with limitedData first, then ascending percentage', async () => {
    await getPreliminaryDataSharing(opensearchClient, {
      currentPage: 0,
      pageSize: 10,
      tags: [],
      timeRange: 'all',
      sort: 'percent_shared_asc',
    });

    expect(mockSearch).toHaveBeenCalledWith({
      searchTags: [],
      currentPage: 0,
      pageSize: 10,
      timeRange: 'all',
      searchScope: 'flat',
      sort: [
        {
          limitedData: {
            order: 'desc',
          },
        },
        {
          percentShared: {
            order: 'asc',
            missing: '_last',
          },
        },
      ],
    });
  });
});
