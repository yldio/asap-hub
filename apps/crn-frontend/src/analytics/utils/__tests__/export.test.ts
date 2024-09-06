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

import { downloadAnalyticsXLSX, getAllData } from '../export';

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

  beforeEach(() => {
    search.mockReset();
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
  });

  it('should create a new workbook and process the selected metrics', async () => {
    await downloadAnalyticsXLSX(algoliaSearchClient)(
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
        ASAPALabResourceValue: 4,
        ASAPALabResourceAverage: 'Average',
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
        'ASAP Lab Resource Output: Value': 0,
        'ASAP Lab Resource Output: Average': 'Below',
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
        'ASAP Lab Resource Output: Average': 'Below',
        'ASAP Lab Resource Output: Name of teams collaborated with': '',
        'ASAP Lab Resource Output: No. of teams collaborated with': 0,
        'ASAP Lab Resource Output: Value': 0,
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
        Events: 2,
        Members: 5,
        'Total Speakers': 3,
        'Unique Speakers (All Roles): Percentage': '67%',
        'Unique Speakers (All Roles): Value': 2,
        'Unique Speakers (Key Personnel): Percentage': '33%',
        'Unique Speakers (Key Personnel): Value': 1,
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
});
