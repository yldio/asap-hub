import {
  AlgoliaSearchClient,
  ClientSearchResponse,
  createAlgoliaResponse,
} from '@asap-hub/algolia';
import {
  listEngagementResponse,
  performanceByDocumentType,
  teamCollaborationPerformance,
  teamCollaborationResponse,
  teamLeadershipResponse,
  teamProductivityResponse,
  userCollaborationPerformance,
  userCollaborationResponse,
  userProductivityPerformance,
  userProductivityResponse,
} from '@asap-hub/fixtures';
import { MetricExportKeys } from '@asap-hub/model';
import { when } from 'jest-when';
import * as XLSX from 'xlsx';

import {
  downloadAnalyticsXLSX,
  getAllData,
  getPerformanceRanking,
  formatPercentage,
} from '../export';
import { OpensearchMetricsFacade } from '../../../hooks/opensearch';

jest.mock('xlsx', () => ({
  utils: {
    book_new: jest.fn().mockReturnValue('workbook'),
    json_to_sheet: jest.fn().mockReturnValue('worksheet'),
    book_append_sheet: jest.fn(),
  },
  writeFile: jest.fn(),
}));

describe('getAllData', () => {
  const mockTransform = jest.fn((result) => ({ id: result.id }));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch data from multiple pages and apply the transform function', async () => {
    const mockGetResults = jest
      .fn()
      .mockResolvedValueOnce({
        total: 100,
        items: [{ id: 1 }, { id: 2 }, { id: 3 }],
      })
      .mockResolvedValueOnce({
        total: 100,
        items: [{ id: 4 }, { id: 5 }, { id: 6 }],
      })
      .mockResolvedValueOnce(undefined);

    const result = await getAllData(mockGetResults, mockTransform);

    expect(mockGetResults).toHaveBeenCalledTimes(3);
    expect(mockTransform).toHaveBeenCalledTimes(6);
    expect(result).toEqual([
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 6 },
    ]);
  });

  it('should stop fetching when no data is returned', async () => {
    const mockGetResults = jest.fn().mockResolvedValue(undefined);

    const result = await getAllData(mockGetResults, mockTransform);

    expect(mockGetResults).toHaveBeenCalledTimes(1);
    expect(mockTransform).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});

describe('downloadAnalyticsXLSX', () => {
  type Search = () => Promise<
    ClientSearchResponse<
      'analytics',
      'team-productivity' | 'team-productivity-performance'
    >
  >;

  const search: jest.MockedFunction<Search> = jest.fn();

  const algoliaSearchClient = {
    search,
  } as unknown as AlgoliaSearchClient<'analytics'>;

  const mockOpensearchMetrics: jest.Mocked<OpensearchMetricsFacade> = {
    getPublicationCompliance: jest.fn(),
    getPreprintCompliance: jest.fn(),
    getAnalyticsOSChampion: jest.fn(),
    getMeetingRepAttendance: jest.fn(),
    getPreliminaryDataSharing: jest.fn(),
  };

  beforeEach(() => {
    search.mockReset();
    // Reset all OpenSearch metric mocks
    Object.values(mockOpensearchMetrics).forEach((mock) => mock.mockReset());
    // Reset XLSX mocks
    jest.clearAllMocks();
    when(algoliaSearchClient.search)
      .calledWith(['user-productivity'], '', expect.anything())
      .mockResolvedValue(
        createAlgoliaResponse<'analytics', 'user-productivity'>([
          {
            ...userProductivityResponse,
            objectID: userProductivityResponse.id,
            __meta: { type: 'user-productivity' },
          },
        ]),
      );

    when(algoliaSearchClient.search)
      .calledWith(['user-productivity-performance'], '', expect.anything())
      .mockResolvedValue(
        createAlgoliaResponse<'analytics', 'user-productivity-performance'>([
          {
            ...userProductivityPerformance,
            objectID: '12',
            __meta: {
              type: 'user-productivity-performance',
              range: 'current-year',
            },
          },
        ]),
      );

    when(algoliaSearchClient.search)
      .calledWith(['team-productivity'], '', expect.anything())
      .mockResolvedValue(
        createAlgoliaResponse<'analytics', 'team-productivity'>([
          {
            ...teamProductivityResponse,
            objectID: teamProductivityResponse.id,
            __meta: { type: 'team-productivity' },
          },
        ]),
      );

    when(algoliaSearchClient.search)
      .calledWith(['team-productivity-performance'], '', expect.anything())
      .mockResolvedValue(
        createAlgoliaResponse<'analytics', 'team-productivity-performance'>([
          {
            ...performanceByDocumentType,
            objectID: '12',
            __meta: {
              type: 'team-productivity-performance',
              range: 'current-year',
            },
          },
        ]),
      );

    when(algoliaSearchClient.search)
      .calledWith(['user-collaboration'], '', expect.anything())
      .mockResolvedValue(
        createAlgoliaResponse<'analytics', 'user-collaboration'>([
          {
            ...userCollaborationResponse.items[0]!,
            objectID: `${
              userCollaborationResponse.items[0]!.id
            }-user-collaboration-current-year`,
            __meta: { type: 'user-collaboration', range: 'current-year' },
          },
        ]),
      );

    when(algoliaSearchClient.search)
      .calledWith(['user-collaboration-performance'], '', expect.anything())
      .mockResolvedValue(
        createAlgoliaResponse<'analytics', 'user-collaboration-performance'>([
          {
            ...userCollaborationPerformance,
            objectID: '1',
            __meta: {
              type: 'user-collaboration-performance',
              range: 'current-year',
              documentCategory: 'all',
            },
          },
        ]),
      );

    when(algoliaSearchClient.search)
      .calledWith(['team-collaboration'], '', expect.anything())
      .mockResolvedValue(
        createAlgoliaResponse<'analytics', 'team-collaboration'>([
          {
            ...teamCollaborationResponse.items[0]!,
            objectID: `${
              teamCollaborationResponse.items[0]!.id
            }-team-collaboration-current-year`,
            __meta: { type: 'team-collaboration', range: 'current-year' },
          },
        ]),
      );

    when(algoliaSearchClient.search)
      .calledWith(['team-collaboration-performance'], '', expect.anything())
      .mockResolvedValue(
        createAlgoliaResponse<'analytics', 'team-collaboration-performance'>([
          {
            ...teamCollaborationPerformance,
            objectID: '1',
            __meta: {
              type: 'team-collaboration-performance',
              range: 'current-year',
              documentCategory: 'all',
            },
          },
        ]),
      );

    when(algoliaSearchClient.search)
      .calledWith(['team-leadership'], '', expect.anything())
      .mockResolvedValue(
        createAlgoliaResponse<'analytics', 'team-leadership'>([
          {
            ...teamLeadershipResponse,
            objectID: teamLeadershipResponse.id,
            __meta: { type: 'team-leadership' },
          },
        ]),
      );

    when(algoliaSearchClient.search)
      .calledWith(['engagement'], '', expect.anything())
      .mockResolvedValue(
        createAlgoliaResponse<'analytics', 'engagement'>([
          {
            ...listEngagementResponse.items[0]!,
            __meta: { type: 'engagement' },
          },
        ]),
      );

    when(algoliaSearchClient.search)
      .calledWith(['engagement-performance'], '', expect.anything())
      .mockResolvedValue(
        createAlgoliaResponse<'analytics', 'engagement-performance'>([
          {
            events: {
              aboveAverageMax: -1,
              aboveAverageMin: -1,
              averageMax: 0,
              averageMin: 0,
              belowAverageMax: -1,
              belowAverageMin: -1,
            },
            totalSpeakers: {
              aboveAverageMax: -1,
              aboveAverageMin: -1,
              averageMax: 0,
              averageMin: 0,
              belowAverageMax: -1,
              belowAverageMin: -1,
            },
            uniqueAllRoles: {
              aboveAverageMax: -1,
              aboveAverageMin: -1,
              averageMax: 0,
              averageMin: 0,
              belowAverageMax: -1,
              belowAverageMin: -1,
            },
            uniqueKeyPersonnel: {
              aboveAverageMax: -1,
              aboveAverageMin: -1,
              averageMax: 0,
              averageMin: 0,
              belowAverageMax: -1,
              belowAverageMin: -1,
            },
            objectID: '1',
            __meta: {
              type: 'engagement-performance',
              range: 'current-year',
              documentCategory: 'all',
            },
          },
        ]),
      );
  });

  it('should create a new workbook and process the selected metrics', async () => {
    await downloadAnalyticsXLSX({
      algoliaClient: algoliaSearchClient,
      opensearchMetrics: mockOpensearchMetrics,
    })(
      'current-year',
      new Set([
        'user-productivity',
        'team-productivity',
        'user-collaboration-within',
        'user-collaboration-across',
        'team-collaboration-within',
        'team-collaboration-across',
        'ig-leadership',
        'wg-leadership',
        'engagement',
      ]) as Set<MetricExportKeys>,
    );

    expect(XLSX.utils.book_new).toHaveBeenCalled();

    expect(XLSX.utils.json_to_sheet).toHaveBeenNthCalledWith(1, [
      {
        user: 'Test User',
        status: 'Active',
        teamA: 'Team A',
        roleA: 'Collaborating PI',
        teamB: '',
        roleB: '',
        ASAPOutputAverage: 'Below',
        ASAPOutputValue: 1,
        ASAPPublicOutputAverage: 'Average',
        ASAPPublicOutputValue: 2,
        ratio: '0.50',
      },
    ]);
    expect(XLSX.utils.book_append_sheet).toHaveBeenNthCalledWith(
      1,
      'workbook',
      'worksheet',
      'User Productivity',
    );

    expect(XLSX.utils.json_to_sheet).toHaveBeenNthCalledWith(2, [
      {
        team: 'Test Team',
        status: 'Active',
        ASAPArticleOutputValue: 1,
        ASAPArticleOutputAverage: 'Below',
        ASAPBioinformaticOutputValue: 2,
        ASAPBioinformaticOutputAverage: 'Below',
        ASAPDatasetOutputValue: 3,
        ASAPDatasetOutputAverage: 'Below',
        ASAPALabMaterialValue: 4,
        ASAPALabMaterialAverage: 'Average',
        ASAPProtocolValue: 5,
        ASAPProtocolAverage: 'Above',
      },
    ]);
    expect(XLSX.utils.book_append_sheet).toHaveBeenNthCalledWith(
      2,
      'workbook',
      'worksheet',
      'Team Productivity',
    );

    expect(XLSX.utils.json_to_sheet).toHaveBeenNthCalledWith(3, [
      {
        User: 'Test User',
        'User Status': 'Active',
        'Alumni Since': '',
        'Team A': 'Team A',
        'Role A': 'Collaborating PI',
        'Team Status A': 'Active',
        'Team Inactive Since A': '',
        'User Team Inactive Since A': '',
        'User Team Status A': 'Active',
        'Outputs Co-Authored: Average A': 'Below',
        'Outputs Co-Authored: Value A': 2,
        'Team B': '',
        'Role B': '',
        'Team Status B': '',
        'User Team Inactive Since B': '',
        'Team Inactive Since B': '',
        'User Team Status B': '',
        'Outputs Co-Authored: Average B': '',
        'Outputs Co-Authored: Value B': '',
        'Team C': '',
        'Role C': '',
        'Team Status C': '',
        'User Team Inactive Since C': '',
        'Team Inactive Since C': '',
        'User Team Status C': '',
        'Outputs Co-Authored: Average C': '',
        'Outputs Co-Authored: Value C': '',
      },
    ]);
    expect(XLSX.utils.book_append_sheet).toHaveBeenNthCalledWith(
      3,
      'workbook',
      'worksheet',
      'User Co-Prod Within Team',
    );

    expect(XLSX.utils.json_to_sheet).toHaveBeenNthCalledWith(4, [
      {
        User: 'Test User',
        'User Status': 'Active',
        'Alumni Since': '',
        'Team A': 'Team A',
        'Role A': 'Collaborating PI',
        'Team Status A': 'Active',
        'Team Inactive Since A': '',
        'User Team Inactive Since A': '',
        'User Team Status A': 'Active',
        'Outputs Co-Authored: Average A': 'Average',
        'Outputs Co-Authored: Value A': 1,
        'Team B': '',
        'Role B': '',
        'Team Status B': '',
        'User Team Inactive Since B': '',
        'Team Inactive Since B': '',
        'User Team Status B': '',
        'Outputs Co-Authored: Average B': '',
        'Outputs Co-Authored: Value B': '',
        'Team C': '',
        'Role C': '',
        'Team Status C': '',
        'User Team Inactive Since C': '',
        'Team Inactive Since C': '',
        'User Team Status C': '',
        'Outputs Co-Authored: Average C': '',
        'Outputs Co-Authored: Value C': '',
      },
    ]);
    expect(XLSX.utils.book_append_sheet).toHaveBeenNthCalledWith(
      4,
      'workbook',
      'worksheet',
      'User Co-Prod Across Teams',
    );

    expect(XLSX.utils.json_to_sheet).toHaveBeenNthCalledWith(5, [
      {
        Team: 'Team 1',
        'Team Status': 'Active',
        'Inactive Since': '',
        'ASAP Article Output: Value': 1,
        'ASAP Article Output: Average': 'Below',
        'ASAP Bioinformatic Output: Value': 0,
        'ASAP Bioinformatic Output: Average': 'Below',
        'ASAP Dataset Output: Value': 0,
        'ASAP Dataset Output: Average': 'Below',
        'ASAP Lab Material Output: Value': 0,
        'ASAP Lab Material Output: Average': 'Below',
        'ASAP Protocol Output: Value': 1,
        'ASAP Protocol Output: Average': 'Average',
      },
    ]);
    expect(XLSX.utils.book_append_sheet).toHaveBeenNthCalledWith(
      5,
      'workbook',
      'worksheet',
      'Team Co-Prod Within Team',
    );

    expect(XLSX.utils.json_to_sheet).toHaveBeenNthCalledWith(6, [
      {
        Team: 'Team 1',
        'Team Status': 'Active',
        'Inactive Since': '',
        'ASAP Article Output: Average': 'Below',
        'ASAP Article Output: Name of teams collaborated with': 'Team 2',
        'ASAP Article Output: No. of teams collaborated with': 1,
        'ASAP Article Output: Value': 1,
        'ASAP Bioinformatic Output: Average': 'Below',
        'ASAP Bioinformatic Output: Value': 0,
        'ASAP Bioinformatics Output: Name of teams collaborated with': '',
        'ASAP Bioinformatics Output: No. of teams collaborated with': 0,
        'ASAP Dataset Output: Average': 'Below',
        'ASAP Dataset Output: Name of teams collaborated with': '',
        'ASAP Dataset Output: No. of teams collaborated with': 0,
        'ASAP Dataset Output: Value': 0,
        'ASAP Lab Material Output: Average': 'Below',
        'ASAP Lab Material Output: Name of teams collaborated with': '',
        'ASAP Lab Material Output: No. of teams collaborated with': 0,
        'ASAP Lab Material Output: Value': 0,
        'ASAP Protocol Output: Average': 'Average',
        'ASAP Protocol Output: Name of teams collaborated with': 'Team 2',
        'ASAP Protocol Output: No. of teams collaborated with': 1,
        'ASAP Protocol Output: Value': 1,
      },
    ]);
    expect(XLSX.utils.book_append_sheet).toHaveBeenNthCalledWith(
      6,
      'workbook',
      'worksheet',
      'Team Co-Prod Across Teams',
    );

    expect(XLSX.utils.json_to_sheet).toHaveBeenNthCalledWith(7, [
      {
        Team: 'Team 1',
        'Team Status': 'Active',
        'Inactive Since': '',
        'Currently in a leadership role': '5',
        'Currently a member': '7',
        'Previously in a leadership role': '6',
        'Previously a member': '8',
      },
    ]);
    expect(XLSX.utils.book_append_sheet).toHaveBeenNthCalledWith(
      7,
      'workbook',
      'worksheet',
      'Interest Groups',
    );

    expect(XLSX.utils.json_to_sheet).toHaveBeenNthCalledWith(8, [
      {
        Team: 'Team 1',
        'Team Status': 'Active',
        'Inactive Since': '',
        'Currently a member': '3',
        'Currently in a leadership role': '1',
        'Previously a member': '4',
        'Previously in a leadership role': '2',
      },
    ]);
    expect(XLSX.utils.book_append_sheet).toHaveBeenNthCalledWith(
      8,
      'workbook',
      'worksheet',
      'Working Groups',
    );

    expect(XLSX.utils.json_to_sheet).toHaveBeenNthCalledWith(9, [
      {
        Team: 'Test Team',
        'Team Status': 'Active',
        'Inactive Since': '',
        'Events: Value': 2,
        'Events: Average': 'Above',
        Members: 5,
        'Total Speakers: Value': 3,
        'Total Speakers: Average': 'Above',
        'Unique Speakers (All Roles): Percentage': '67%',
        'Unique Speakers (All Roles): Value': 2,
        'Unique Speakers (All Roles): Average': 'Above',
        'Unique Speakers (Key Personnel): Percentage': '33%',
        'Unique Speakers (Key Personnel): Value': 1,
        'Unique Speakers (Key Personnel): Average': 'Above',
      },
    ]);
    expect(XLSX.utils.book_append_sheet).toHaveBeenNthCalledWith(
      9,
      'workbook',
      'worksheet',
      'Speaker Diversity',
    );

    expect(XLSX.writeFile).toHaveBeenCalledWith(
      'workbook',
      expect.stringContaining('crn-analytics-current-year'),
    );
  });

  it('should process OpenSearch metrics correctly', async () => {
    // Mock OpenSearch metric responses
    mockOpensearchMetrics.getPublicationCompliance.mockResolvedValue({
      items: [
        {
          objectID: 'pub-comp-1',
          teamId: 'team-alpha',
          teamName: 'Team Alpha',
          isTeamInactive: false,
          numberOfPublications: 10,
          overallCompliance: 85,
          ranking: 'ADEQUATE',
          numberOfOutputs: 50,
          numberOfDatasets: 20,
          datasetsPercentage: 90,
          datasetsRanking: 'OUTSTANDING',
          numberOfProtocols: 10,
          protocolsPercentage: 80,
          protocolsRanking: 'ADEQUATE',
          numberOfCode: 5,
          codePercentage: 75,
          codeRanking: 'ADEQUATE',
          numberOfLabMaterials: 15,
          labMaterialsPercentage: 95,
          labMaterialsRanking: 'OUTSTANDING',
          timeRange: 'all',
        },
      ],
      total: 1,
    });

    mockOpensearchMetrics.getPreprintCompliance.mockResolvedValue({
      items: [
        {
          objectID: 'preprint-comp-1',
          teamId: 'team-beta',
          teamName: 'Team Beta',
          isTeamInactive: false,
          numberOfPreprints: 5,
          numberOfPublications: 10,
          postedPriorPercentage: 60,
          ranking: 'NEEDS IMPROVEMENT',
          timeRange: 'all',
        },
      ],
      total: 1,
    });

    mockOpensearchMetrics.getPreliminaryDataSharing.mockResolvedValue({
      items: [
        {
          teamId: 'team-1',
          teamName: 'Team Gamma',
          isTeamInactive: false,
          limitedData: false,
          percentShared: 75,
          timeRange: 'last-year',
        },
      ],
      total: 1,
    });

    mockOpensearchMetrics.getMeetingRepAttendance.mockResolvedValue({
      items: [
        {
          teamId: 'team-2',
          teamName: 'Team Delta',
          isTeamInactive: false,
          attendancePercentage: 88,
          limitedData: false,
          timeRange: 'all',
        },
      ],
      total: 1,
    });

    mockOpensearchMetrics.getAnalyticsOSChampion.mockResolvedValue({
      items: [
        {
          objectID: 'os-champ-1',
          teamId: 'team-3',
          teamName: 'Team Epsilon',
          isTeamInactive: false,
          teamAwardsCount: 3,
          timeRange: 'all',
          users: [
            {
              id: 'user-1',
              name: 'John Doe',
              awardsCount: 2,
            },
            {
              id: 'user-2',
              name: 'Jane Smith',
              awardsCount: 1,
            },
          ],
        },
      ],
      total: 1,
    });

    await downloadAnalyticsXLSX({
      algoliaClient: algoliaSearchClient,
      opensearchMetrics: mockOpensearchMetrics,
    })(
      'all',
      new Set([
        'publication-compliance',
        'preprint-compliance',
        'preliminary-data-sharing',
        'attendance',
        'os-champion',
      ]) as Set<MetricExportKeys>,
    );

    expect(XLSX.utils.book_new).toHaveBeenCalled();

    // Verify each OpenSearch metric was called with correct parameters
    expect(mockOpensearchMetrics.getPublicationCompliance).toHaveBeenCalledWith(
      {
        timeRange: 'all',
        tags: [],
        currentPage: 0,
        pageSize: 50,
        sort: 'team_asc',
      },
    );

    expect(mockOpensearchMetrics.getPreprintCompliance).toHaveBeenCalledWith({
      tags: [],
      timeRange: 'all',
      currentPage: 0,
      pageSize: 50,
      sort: 'team_asc',
    });

    expect(
      mockOpensearchMetrics.getPreliminaryDataSharing,
    ).toHaveBeenCalledWith({
      tags: [],
      timeRange: 'all',
      currentPage: 0,
      pageSize: 50,
    });

    expect(mockOpensearchMetrics.getMeetingRepAttendance).toHaveBeenCalledWith({
      tags: [],
      timeRange: 'all',
      currentPage: 0,
      pageSize: 50,
      sort: 'team_asc',
    });

    expect(mockOpensearchMetrics.getAnalyticsOSChampion).toHaveBeenCalledWith({
      tags: [],
      timeRange: 'all',
      currentPage: 0,
      pageSize: 50,
      sort: 'team_asc',
    });

    // Verify that worksheets were created with correct data transformation
    expect(XLSX.utils.json_to_sheet).toHaveBeenCalledWith([
      {
        'Team Name': 'Team Alpha',
        'Team Status': 'Active',
        '# Publications': 10,
        'Publications %': '85%',
        'Publications Ranking': 'Adequate',
        '# Outputs': 50,
        '# Datasets': 20,
        'Datasets %': '90%',
        'Datasets Ranking': 'Outstanding',
        '# Protocols': 10,
        'Protocols %': '80%',
        'Protocols Ranking': 'Adequate',
        '# Code': 5,
        'Code %': '75%',
        'Code Ranking': 'Needs Improvement',
        '# Lab Materials': 15,
        'Lab Materials %': '95%',
        'Lab Materials Ranking': 'Outstanding',
      },
    ]);

    expect(XLSX.utils.json_to_sheet).toHaveBeenCalledWith([
      {
        'Team Name': 'Team Beta',
        'Team Status': 'Active',
        'Number of Preprints': 5,
        'Posted Prior to Journal Submission': '60%',
        Ranking: 'Needs Improvement',
      },
    ]);

    expect(XLSX.utils.json_to_sheet).toHaveBeenCalledWith([
      {
        'Team Name': 'Team Gamma',
        'Team Status': 'Active',
        'Percent Shared': '75%',
        Ranking: 'Needs Improvement',
      },
    ]);

    expect(XLSX.utils.json_to_sheet).toHaveBeenCalledWith([
      {
        'Team Name': 'Team Delta',
        'Team Status': 'Active',
        Attendance: '88%',
        Ranking: 'Adequate',
      },
    ]);

    // OS Champion creates multiple rows for users
    expect(XLSX.utils.json_to_sheet).toHaveBeenCalledWith([
      {
        'Team Name': 'Team Epsilon',
        'Team Status': 'Active',
        'User Name': 'John Doe',
        'No.of Awards': '2',
      },
      {
        'Team Name': 'Team Epsilon',
        'Team Status': 'Active',
        'User Name': 'Jane Smith',
        'No.of Awards': '1',
      },
    ]);

    // Verify correct sheet names were used
    expect(XLSX.utils.book_append_sheet).toHaveBeenCalledWith(
      'workbook',
      'worksheet',
      'Publication Compliance',
    );
    expect(XLSX.utils.book_append_sheet).toHaveBeenCalledWith(
      'workbook',
      'worksheet',
      'Preprint Compliance',
    );
    expect(XLSX.utils.book_append_sheet).toHaveBeenCalledWith(
      'workbook',
      'worksheet',
      'Share Preliminary Findings',
    );
    expect(XLSX.utils.book_append_sheet).toHaveBeenCalledWith(
      'workbook',
      'worksheet',
      'Meeting Rep Attendance',
    );
    expect(XLSX.utils.book_append_sheet).toHaveBeenCalledWith(
      'workbook',
      'worksheet',
      'Open Science Championship',
    );

    expect(XLSX.writeFile).toHaveBeenCalledWith(
      'workbook',
      expect.stringContaining('crn-analytics-all'),
    );
  });

  it('should handle empty OpenSearch responses gracefully', async () => {
    // Mock empty responses
    mockOpensearchMetrics.getPublicationCompliance.mockResolvedValue({
      items: [],
      total: 0,
    });

    mockOpensearchMetrics.getPreprintCompliance.mockResolvedValue({
      items: [],
      total: 0,
    });

    await downloadAnalyticsXLSX({
      algoliaClient: algoliaSearchClient,
      opensearchMetrics: mockOpensearchMetrics,
    })(
      'last-year',
      new Set([
        'publication-compliance',
        'preprint-compliance',
      ]) as Set<MetricExportKeys>,
    );

    expect(XLSX.utils.json_to_sheet).toHaveBeenCalledWith([]);
    expect(XLSX.utils.book_append_sheet).toHaveBeenCalledTimes(2);
  });

  it('should handle limited time range for preliminary-data-sharing and attendance', async () => {
    mockOpensearchMetrics.getPreliminaryDataSharing.mockResolvedValue({
      items: [],
      total: 0,
    });

    mockOpensearchMetrics.getMeetingRepAttendance.mockResolvedValue({
      items: [],
      total: 0,
    });

    await downloadAnalyticsXLSX({
      algoliaClient: algoliaSearchClient,
      opensearchMetrics: mockOpensearchMetrics,
    })(
      'last-year',
      new Set([
        'preliminary-data-sharing',
        'attendance',
      ]) as Set<MetricExportKeys>,
    );

    // These metrics support limited time ranges
    expect(
      mockOpensearchMetrics.getPreliminaryDataSharing,
    ).toHaveBeenCalledWith({
      tags: [],
      timeRange: 'last-year',
      currentPage: 0,
      pageSize: 50,
    });

    expect(mockOpensearchMetrics.getMeetingRepAttendance).toHaveBeenCalledWith({
      tags: [],
      timeRange: 'last-year',
      currentPage: 0,
      pageSize: 50,
      sort: 'team_asc',
    });
  });
});

describe('getPerformanceRanking', () => {
  it.each`
    percentage | isLimitedData | expected
    ${null}    | ${false}      | ${'Limited Data'}
    ${null}    | ${true}       | ${'Limited Data'}
    ${85}      | ${true}       | ${'Limited Data'}
    ${95}      | ${true}       | ${'Limited Data'}
    ${95}      | ${false}      | ${'Outstanding'}
    ${90}      | ${false}      | ${'Outstanding'}
    ${89}      | ${false}      | ${'Adequate'}
    ${80}      | ${false}      | ${'Adequate'}
    ${79}      | ${false}      | ${'Needs Improvement'}
    ${0}       | ${false}      | ${'Needs Improvement'}
  `(
    'returns $expected when percentage is $percentage and isLimitedData is $isLimitedData',
    ({ percentage, isLimitedData, expected }) => {
      expect(getPerformanceRanking(percentage, isLimitedData)).toBe(expected);
    },
  );
});

describe('formatPercentage', () => {
  it.each`
    percentage | result
    ${null}    | ${'N/A'}
    ${95}      | ${'95%'}
  `('exports correct format for $percentage%', ({ percentage, result }) => {
    expect(formatPercentage(percentage)).toEqual(result);
  });
});
