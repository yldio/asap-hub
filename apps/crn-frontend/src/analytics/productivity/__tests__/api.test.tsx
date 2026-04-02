import {
  teamProductivityResponse,
  userProductivityPerformance,
  userProductivityResponse,
  teamProductivityPerformance,
} from '@asap-hub/fixtures';
import { SortTeamProductivity, SortUserProductivity } from '@asap-hub/model';
import nock from 'nock';

import { AnalyticsSearchOptionsWithFiltering } from '../../utils/analytics-options';
import {
  getTeamProductivity,
  getTeamProductivityPerformance,
  getUserProductivity,
  getUserProductivityPerformance,
} from '../api';
import { OpensearchClient } from '../../utils/opensearch';

jest.mock('../../../config');

afterEach(() => {
  nock.cleanAll();
});

const defaultUserOptions: AnalyticsSearchOptionsWithFiltering<SortUserProductivity> =
  {
    pageSize: null,
    currentPage: null,
    timeRange: '30d',
    documentCategory: 'all',
    sort: 'user_asc',
    tags: [],
  };

const defaultTeamOptions: AnalyticsSearchOptionsWithFiltering<SortTeamProductivity> =
  {
    pageSize: null,
    currentPage: null,
    timeRange: '30d',
    outputType: 'all',
    sort: 'team_asc',
    tags: [],
  };

describe('getUserProductivity', () => {
  let opensearchClient: OpensearchClient<typeof userProductivityResponse>;
  let searchSpy: jest.SpyInstance;

  beforeEach(() => {
    opensearchClient = new OpensearchClient(
      'user-productivity',
      'Bearer test-token',
    );
    searchSpy = jest.spyOn(opensearchClient, 'search').mockResolvedValue({
      items: [userProductivityResponse],
      total: 1,
    });
  });

  afterEach(() => {
    searchSpy.mockRestore();
  });

  it('calls opensearch client with correct parameters', async () => {
    await getUserProductivity(opensearchClient, defaultUserOptions);

    expect(searchSpy).toHaveBeenCalledWith({
      searchTags: [],
      currentPage: undefined,
      pageSize: undefined,
      timeRange: '30d',
      searchScope: 'extended',
      documentCategory: 'all',
      sort: expect.any(Array),
    });
  });

  it('passes tags to opensearch client', async () => {
    await getUserProductivity(opensearchClient, {
      ...defaultUserOptions,
      tags: ['Team Alpha', 'User Beta'],
    });

    expect(searchSpy).toHaveBeenCalledWith({
      searchTags: ['Team Alpha', 'User Beta'],
      currentPage: undefined,
      pageSize: undefined,
      timeRange: '30d',
      searchScope: 'extended',
      documentCategory: 'all',
      sort: expect.any(Array),
    });
  });

  it('passes pagination parameters to opensearch client', async () => {
    await getUserProductivity(opensearchClient, {
      ...defaultUserOptions,
      currentPage: 2,
      pageSize: 20,
    });

    expect(searchSpy).toHaveBeenCalledWith({
      searchTags: [],
      currentPage: 2,
      pageSize: 20,
      timeRange: '30d',
      searchScope: 'extended',
      documentCategory: 'all',
      sort: expect.any(Array),
    });
  });

  it('passes time range to opensearch client', async () => {
    await getUserProductivity(opensearchClient, {
      ...defaultUserOptions,
      timeRange: '90d',
    });

    expect(searchSpy).toHaveBeenCalledWith({
      searchTags: [],
      currentPage: undefined,
      pageSize: undefined,
      timeRange: '90d',
      searchScope: 'extended',
      documentCategory: 'all',
      sort: expect.any(Array),
    });
  });

  it('passes document category to opensearch client', async () => {
    await getUserProductivity(opensearchClient, {
      ...defaultUserOptions,
      documentCategory: 'article',
    });

    expect(searchSpy).toHaveBeenCalledWith({
      searchTags: [],
      currentPage: undefined,
      pageSize: undefined,
      timeRange: '30d',
      searchScope: 'extended',
      documentCategory: 'article',
      sort: expect.any(Array),
    });
  });

  it('applies user_asc sort correctly', async () => {
    await getUserProductivity(opensearchClient, {
      ...defaultUserOptions,
      sort: 'user_asc',
    });

    expect(searchSpy).toHaveBeenCalledWith({
      searchTags: [],
      currentPage: undefined,
      pageSize: undefined,
      timeRange: '30d',
      searchScope: 'extended',
      documentCategory: 'all',
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
    });
  });

  it('applies user_desc sort correctly', async () => {
    await getUserProductivity(opensearchClient, {
      ...defaultUserOptions,
      sort: 'user_desc',
    });

    const callArg = searchSpy.mock.calls[0][0];
    // eslint-disable-next-line no-underscore-dangle
    expect(callArg.sort[0]._script.order).toBe('desc');
  });

  it('applies team_asc sort with nested path', async () => {
    await getUserProductivity(opensearchClient, {
      ...defaultUserOptions,
      sort: 'team_asc',
    });

    expect(searchSpy).toHaveBeenCalledWith({
      searchTags: [],
      currentPage: undefined,
      pageSize: undefined,
      timeRange: '30d',
      searchScope: 'extended',
      documentCategory: 'all',
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
    });
  });

  it('applies asap_output_asc sort correctly', async () => {
    await getUserProductivity(opensearchClient, {
      ...defaultUserOptions,
      sort: 'asap_output_asc',
    });

    expect(searchSpy).toHaveBeenCalledWith({
      searchTags: [],
      currentPage: undefined,
      pageSize: undefined,
      timeRange: '30d',
      searchScope: 'extended',
      documentCategory: 'all',
      sort: [
        {
          asapOutput: {
            order: 'asc',
          },
        },
      ],
    });
  });

  it('applies ratio_desc sort correctly', async () => {
    await getUserProductivity(opensearchClient, {
      ...defaultUserOptions,
      sort: 'ratio_desc',
    });

    expect(searchSpy).toHaveBeenCalledWith({
      searchTags: [],
      currentPage: undefined,
      pageSize: undefined,
      timeRange: '30d',
      searchScope: 'extended',
      documentCategory: 'all',
      sort: [
        {
          ratio: { order: 'desc' },
        },
      ],
    });
  });

  it('applies role_asc sort with nested path and missing value handling', async () => {
    await getUserProductivity(opensearchClient, {
      ...defaultUserOptions,
      sort: 'role_asc',
    });

    expect(searchSpy).toHaveBeenCalledWith({
      searchTags: [],
      currentPage: undefined,
      pageSize: undefined,
      timeRange: '30d',
      searchScope: 'extended',
      documentCategory: 'all',
      sort: [
        {
          'teams.role': {
            nested: { path: 'teams' },
            order: 'asc',
            missing: '_last',
          },
        },
      ],
    });
  });

  it('returns the result from opensearch client', async () => {
    const mockResult = {
      items: [userProductivityResponse],
      total: 1,
    };
    searchSpy.mockResolvedValue(mockResult);

    const result = await getUserProductivity(
      opensearchClient,
      defaultUserOptions,
    );

    expect(result).toEqual(mockResult);
  });
});

describe('getTeamProductivity', () => {
  let opensearchClient: OpensearchClient<typeof teamProductivityResponse>;
  let searchSpy: jest.SpyInstance;

  beforeEach(() => {
    opensearchClient = new OpensearchClient(
      'team-productivity',
      'Bearer test-token',
    );
    searchSpy = jest.spyOn(opensearchClient, 'search').mockResolvedValue({
      items: [teamProductivityResponse],
      total: 1,
    });
  });

  afterEach(() => {
    searchSpy.mockRestore();
  });

  it('calls opensearch client with correct parameters', async () => {
    await getTeamProductivity(opensearchClient, defaultTeamOptions);

    expect(searchSpy).toHaveBeenCalledWith({
      searchTags: [],
      currentPage: undefined,
      pageSize: undefined,
      timeRange: '30d',
      searchScope: 'flat',
      sort: expect.any(Array),
      outputType: 'all',
    });
  });

  it('passes tags to opensearch client', async () => {
    await getTeamProductivity(opensearchClient, {
      ...defaultTeamOptions,
      tags: ['Team Alpha', 'Team Beta'],
    });

    expect(searchSpy).toHaveBeenCalledWith({
      searchTags: ['Team Alpha', 'Team Beta'],
      currentPage: undefined,
      pageSize: undefined,
      timeRange: '30d',
      searchScope: 'flat',
      sort: expect.any(Array),
      outputType: 'all',
    });
  });

  it('passes pagination parameters to opensearch client', async () => {
    await getTeamProductivity(opensearchClient, {
      ...defaultTeamOptions,
      currentPage: 2,
      pageSize: 20,
    });

    expect(searchSpy).toHaveBeenCalledWith({
      searchTags: [],
      currentPage: 2,
      pageSize: 20,
      timeRange: '30d',
      searchScope: 'flat',
      sort: expect.any(Array),
      outputType: 'all',
    });
  });

  it('passes time range to opensearch client', async () => {
    await getTeamProductivity(opensearchClient, {
      ...defaultTeamOptions,
      timeRange: '90d',
    });

    expect(searchSpy).toHaveBeenCalledWith({
      searchTags: [],
      currentPage: undefined,
      pageSize: undefined,
      timeRange: '90d',
      searchScope: 'flat',
      sort: expect.any(Array),
      outputType: 'all',
    });
  });

  it('passes output type to opensearch client', async () => {
    await getTeamProductivity(opensearchClient, {
      ...defaultTeamOptions,
      outputType: 'public',
    });

    expect(searchSpy).toHaveBeenCalledWith({
      searchTags: [],
      currentPage: undefined,
      pageSize: undefined,
      timeRange: '30d',
      searchScope: 'flat',
      sort: expect.any(Array),
      outputType: 'public',
    });
  });

  it('applies team_asc sort correctly', async () => {
    await getTeamProductivity(opensearchClient, {
      ...defaultTeamOptions,
      sort: 'team_asc',
    });

    expect(searchSpy).toHaveBeenCalledWith({
      searchTags: [],
      currentPage: undefined,
      pageSize: undefined,
      timeRange: '30d',
      searchScope: 'flat',
      sort: [{ 'name.keyword': { order: 'asc' } }],
      outputType: 'all',
    });
  });

  it('applies team_desc sort correctly', async () => {
    await getTeamProductivity(opensearchClient, {
      ...defaultTeamOptions,
      sort: 'team_desc',
    });

    expect(searchSpy).toHaveBeenCalledWith({
      searchTags: [],
      currentPage: undefined,
      pageSize: undefined,
      timeRange: '30d',
      searchScope: 'flat',
      sort: [{ 'name.keyword': { order: 'desc' } }],
      outputType: 'all',
    });
  });

  it('applies article_asc sort correctly', async () => {
    await getTeamProductivity(opensearchClient, {
      ...defaultTeamOptions,
      sort: 'article_asc',
    });

    expect(searchSpy).toHaveBeenCalledWith({
      searchTags: [],
      currentPage: undefined,
      pageSize: undefined,
      timeRange: '30d',
      searchScope: 'flat',
      sort: [{ Article: { order: 'asc' } }],
      outputType: 'all',
    });
  });

  it('applies dataset_desc sort correctly', async () => {
    await getTeamProductivity(opensearchClient, {
      ...defaultTeamOptions,
      sort: 'dataset_desc',
    });

    expect(searchSpy).toHaveBeenCalledWith({
      searchTags: [],
      currentPage: undefined,
      pageSize: undefined,
      timeRange: '30d',
      searchScope: 'flat',
      sort: [{ Dataset: { order: 'desc' } }],
      outputType: 'all',
    });
  });

  it('returns the result from opensearch client', async () => {
    const mockResult = {
      items: [{ ...teamProductivityResponse, name: 'Test Team' }],
      total: 1,
    };
    searchSpy.mockResolvedValue(mockResult);

    const result = await getTeamProductivity(
      opensearchClient,
      defaultTeamOptions,
    );

    expect(result).toEqual(mockResult);
  });
});

describe('getTeamProductivityPerformance', () => {
  let opensearchClient: OpensearchClient<typeof teamProductivityPerformance>;
  let searchSpy: jest.SpyInstance;

  beforeEach(() => {
    opensearchClient = new OpensearchClient(
      'team-productivity-performance',
      'Bearer test-token',
    );
    searchSpy = jest.spyOn(opensearchClient, 'search').mockResolvedValue({
      items: [teamProductivityPerformance],
      total: 1,
    });
  });

  afterEach(() => {
    searchSpy.mockRestore();
  });

  it('calls opensearch client with correct parameters', async () => {
    await getTeamProductivityPerformance(opensearchClient, {
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

  it('passes different time range to opensearch client', async () => {
    await getTeamProductivityPerformance(opensearchClient, {
      timeRange: '90d',
      outputType: 'all',
    });

    expect(searchSpy).toHaveBeenCalledWith({
      searchTags: [],
      timeRange: '90d',
      searchScope: 'flat',
      sort: [],
      outputType: 'all',
    });
  });

  it('returns the first item from opensearch results', async () => {
    const mockPerformance = {
      ...teamProductivityPerformance,
      Article: {
        belowAverageMin: 0,
        belowAverageMax: 5,
        averageMin: 5,
        averageMax: 15,
        aboveAverageMin: 15,
        aboveAverageMax: 30,
      },
    };
    searchSpy.mockResolvedValue({
      items: [mockPerformance],
      total: 1,
    });

    const result = await getTeamProductivityPerformance(opensearchClient, {
      timeRange: '30d',
      outputType: 'all',
    });

    expect(result).toEqual(mockPerformance);
  });

  it('returns undefined when opensearch returns empty items', async () => {
    searchSpy.mockResolvedValue({
      items: [],
      total: 0,
    });

    const result = await getTeamProductivityPerformance(opensearchClient, {
      timeRange: '30d',
      outputType: 'all',
    });

    expect(result).toBeUndefined();
  });
});

describe('getUserProductivityPerformance', () => {
  let opensearchClient: OpensearchClient<typeof userProductivityPerformance>;
  let searchSpy: jest.SpyInstance;

  beforeEach(() => {
    opensearchClient = new OpensearchClient(
      'user-productivity-performance',
      'Bearer test-token',
    );
    searchSpy = jest.spyOn(opensearchClient, 'search').mockResolvedValue({
      items: [userProductivityPerformance],
      total: 1,
    });
  });

  afterEach(() => {
    searchSpy.mockRestore();
  });

  it('calls opensearch client with correct parameters', async () => {
    await getUserProductivityPerformance(opensearchClient, {
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

  it('passes different time range to opensearch client', async () => {
    await getUserProductivityPerformance(opensearchClient, {
      timeRange: '90d',
      documentCategory: 'all',
    });

    expect(searchSpy).toHaveBeenCalledWith({
      searchTags: [],
      timeRange: '90d',
      searchScope: 'flat',
      sort: [],
      documentCategory: 'all',
    });
  });

  it('passes different document category to opensearch client', async () => {
    await getUserProductivityPerformance(opensearchClient, {
      timeRange: '30d',
      documentCategory: 'article',
    });

    expect(searchSpy).toHaveBeenCalledWith({
      searchTags: [],
      timeRange: '30d',
      searchScope: 'flat',
      sort: [],
      documentCategory: 'article',
    });
  });

  it('returns the first item from opensearch results', async () => {
    const mockPerformance = {
      ...userProductivityPerformance,
      asapOutput: {
        belowAverageMin: 0,
        belowAverageMax: 3,
        averageMin: 3,
        averageMax: 8,
        aboveAverageMin: 8,
        aboveAverageMax: 20,
      },
    };
    searchSpy.mockResolvedValue({
      items: [mockPerformance],
      total: 1,
    });

    const result = await getUserProductivityPerformance(opensearchClient, {
      timeRange: '30d',
      documentCategory: 'all',
    });

    expect(result).toEqual(mockPerformance);
  });

  it('returns undefined when opensearch returns empty items', async () => {
    searchSpy.mockResolvedValue({
      items: [],
      total: 0,
    });

    const result = await getUserProductivityPerformance(opensearchClient, {
      timeRange: '30d',
      documentCategory: 'all',
    });

    expect(result).toBeUndefined();
  });
});
