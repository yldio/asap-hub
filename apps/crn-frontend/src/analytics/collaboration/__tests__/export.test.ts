import {
  TeamCollaborationDataObject,
  TeamCollaborationPerformance,
  UserCollaborationDataObject,
  UserCollaborationPerformance,
} from '@asap-hub/model';
import {
  userCollaborationToCSV,
  teamCollaborationAcrossTeamToCSV,
  teamCollaborationWithinTeamToCSV,
} from '../export';

const performanceMetric = {
  belowAverageMin: 1,
  belowAverageMax: 2,
  averageMin: 3,
  averageMax: 4,
  aboveAverageMin: 5,
  aboveAverageMax: 6,
};

describe('userCollaborationToCSV', () => {
  const data: UserCollaborationDataObject = {
    id: '1',
    name: 'Jane Doe',
    teams: [
      {
        id: 'test-1',
        team: 'Test 1',
        outputsCoAuthoredAcrossTeams: 0,
        outputsCoAuthoredWithinTeam: 1,
        role: 'Key Personnel',
        teamInactiveSince: undefined,
        teamMembershipInactiveSince: '2024-02-06T00:00:00.000-03:00',
      },
      {
        id: 'de-camilli',
        team: 'De Camilli',
        outputsCoAuthoredAcrossTeams: 1,
        outputsCoAuthoredWithinTeam: 2,
        role: 'Project Manager',
        teamInactiveSince: '2024-02-15T00:00:00.000Z',
        teamMembershipInactiveSince: undefined,
      },
    ],
  };
  const performance: UserCollaborationPerformance = {
    withinTeam: performanceMetric,
    acrossTeam: performanceMetric,
  };

  it.each`
    documentCategory    | prefix
    ${'all'}            | ${'Outputs'}
    ${'article'}        | ${'Article Outputs'}
    ${'bioinformatics'} | ${'Bioinformatic Outputs'}
    ${'dataset'}        | ${'Dataset Outputs'}
    ${'lab-resource'}   | ${'Lab Resource Outputs'}
    ${'protocol'}       | ${'Protocol Outputs'}
    ${'not-valid'}      | ${'Outputs'}
  `(
    `exports within-team data when document category is $documentCategory`,
    ({ documentCategory, prefix }) => {
      expect(
        userCollaborationToCSV(
          'within-team',
          performance,
          documentCategory,
        )(data),
      ).toEqual({
        User: 'Jane Doe',
        'User Status': 'Active',
        'Alumni Since': '',

        'Team A': 'Test 1',
        'Team Status A': 'Active',
        'Team Inactive Since A': '',
        'Role A': 'Key Personnel',
        'User Team Status A': 'Inactive',
        'User Team Inactive Since A': '2024-02-06T00:00:00.000-03:00',
        [`${prefix} Co-Authored: Value A`]: 1,
        [`${prefix} Co-Authored: Average A`]: 'Below',

        'Team B': 'De Camilli',
        'Team Status B': 'Inactive',
        'Team Inactive Since B': '2024-02-15T00:00:00.000Z',
        'Role B': 'Project Manager',
        'User Team Status B': 'Inactive',
        'User Team Inactive Since B': '',
        [`${prefix} Co-Authored: Value B`]: 2,
        [`${prefix} Co-Authored: Average B`]: 'Below',

        'Team C': '',
        'Team Status C': '',
        'Team Inactive Since C': '',
        'Role C': '',
        'User Team Status C': '',
        'User Team Inactive Since C': '',
        [`${prefix} Co-Authored: Value C`]: '',
        [`${prefix} Co-Authored: Average C`]: '',
      });
    },
  );

  it.each`
    documentCategory    | prefix
    ${'all'}            | ${'Outputs'}
    ${'article'}        | ${'Article Outputs'}
    ${'bioinformatics'} | ${'Bioinformatic Outputs'}
    ${'dataset'}        | ${'Dataset Outputs'}
    ${'lab-resource'}   | ${'Lab Resource Outputs'}
    ${'protocol'}       | ${'Protocol Outputs'}
    ${'not-valid'}      | ${'Outputs'}
  `(
    'exports across-teams data when document category is $documentCategory',
    ({ documentCategory, prefix }) => {
      expect(
        userCollaborationToCSV(
          'across-teams',
          performance,
          documentCategory,
        )(data),
      ).toEqual({
        User: 'Jane Doe',
        'User Status': 'Active',
        'Alumni Since': '',

        'Team A': 'Test 1',
        'Team Status A': 'Active',
        'Team Inactive Since A': '',
        'Role A': 'Key Personnel',
        'User Team Status A': 'Inactive',
        'User Team Inactive Since A': '2024-02-06T00:00:00.000-03:00',
        [`${prefix} Co-Authored: Value A`]: 0,
        [`${prefix} Co-Authored: Average A`]: 'Below',

        'Team B': 'De Camilli',
        'Team Status B': 'Inactive',
        'Team Inactive Since B': '2024-02-15T00:00:00.000Z',
        'Role B': 'Project Manager',
        'User Team Status B': 'Inactive',
        'User Team Inactive Since B': '',
        [`${prefix} Co-Authored: Value B`]: 1,
        [`${prefix} Co-Authored: Average B`]: 'Below',

        'Team C': '',
        'Team Status C': '',
        'Team Inactive Since C': '',
        'Role C': '',
        'User Team Status C': '',
        'User Team Inactive Since C': '',
        [`${prefix} Co-Authored: Value C`]: '',
        [`${prefix} Co-Authored: Average C`]: '',
      });
    },
  );
});

describe('teamCollaborationWithinTeamToCSV', () => {
  const data: TeamCollaborationDataObject = {
    id: '1',
    name: 'Team A',
    inactiveSince: undefined,
    outputsCoProducedWithin: {
      Article: 3,
      Bioinformatics: 3,
      Dataset: 3,
      'Lab Resource': 3,
      Protocol: 3,
    },
    outputsCoProducedAcross: {
      byDocumentType: {
        Article: 5,
        Bioinformatics: 5,
        Dataset: 5,
        'Lab Resource': 5,
        Protocol: 5,
      },
      byTeam: [
        {
          id: '2',
          name: 'Team B',
          isInactive: false,
          Article: 4,
          Bioinformatics: 4,
          Dataset: 4,
          'Lab Resource': 4,
          Protocol: 4,
        },
        {
          id: '3',
          name: 'Team C',
          isInactive: false,
          Article: 1,
          Bioinformatics: 1,
          Dataset: 1,
          'Lab Resource': 1,
          Protocol: 1,
        },
      ],
    },
  };
  const performance: TeamCollaborationPerformance = {
    withinTeam: {
      article: performanceMetric,
      bioinformatics: performanceMetric,
      dataset: performanceMetric,
      labResource: performanceMetric,
      protocol: performanceMetric,
    },
    acrossTeam: {
      article: performanceMetric,
      bioinformatics: performanceMetric,
      dataset: performanceMetric,
      labResource: performanceMetric,
      protocol: performanceMetric,
    },
  };

  it.each`
    outputType  | prefix
    ${'public'} | ${'ASAP Public'}
    ${'all'}    | ${'ASAP'}
  `(
    'handles within-team data when output type is $outputType',
    ({ outputType, prefix }) => {
      expect(
        teamCollaborationWithinTeamToCSV(performance, outputType)(data),
      ).toEqual({
        Team: 'Team A',
        'Team Status': 'Active',
        'Inactive Since': '',
        [`${prefix} Article Output: Value`]: 3,
        [`${prefix} Article Output: Average`]: 'Average',
        [`${prefix} Bioinformatic Output: Value`]: 3,
        [`${prefix} Bioinformatic Output: Average`]: 'Average',
        [`${prefix} Dataset Output: Value`]: 3,
        [`${prefix} Dataset Output: Average`]: 'Average',
        [`${prefix} Lab Resource Output: Value`]: 3,
        [`${prefix} Lab Resource Output: Average`]: 'Average',
        [`${prefix} Protocol Output: Value`]: 3,
        [`${prefix} Protocol Output: Average`]: 'Average',
      });
    },
  );

  it.each`
    outputType  | prefix
    ${'public'} | ${'ASAP Public'}
    ${'all'}    | ${'ASAP'}
  `(
    'handles across-teams data when output type is $outputType',
    ({ outputType, prefix }) => {
      expect(
        teamCollaborationAcrossTeamToCSV(performance, outputType)(data),
      ).toEqual({
        Team: 'Team A',
        'Team Status': 'Active',
        'Inactive Since': '',
        [`${prefix} Article Output: Value`]: 5,
        [`${prefix} Article Output: Average`]: 'Above',
        [`${prefix} Article Output: No. of teams collaborated with`]: 2,
        [`${prefix} Article Output: Name of teams collaborated with`]:
          'Team B, Team C',
        [`${prefix} Bioinformatic Output: Value`]: 5,
        [`${prefix} Bioinformatic Output: Average`]: 'Above',
        [`${prefix} Bioinformatics Output: No. of teams collaborated with`]: 2,
        [`${prefix} Bioinformatics Output: Name of teams collaborated with`]:
          'Team B, Team C',
        [`${prefix} Dataset Output: Value`]: 5,
        [`${prefix} Dataset Output: Average`]: 'Above',
        [`${prefix} Dataset Output: No. of teams collaborated with`]: 2,
        [`${prefix} Dataset Output: Name of teams collaborated with`]:
          'Team B, Team C',
        [`${prefix} Lab Resource Output: Value`]: 5,
        [`${prefix} Lab Resource Output: Average`]: 'Above',
        [`${prefix} Lab Resource Output: No. of teams collaborated with`]: 2,
        [`${prefix} Lab Resource Output: Name of teams collaborated with`]:
          'Team B, Team C',
        [`${prefix} Protocol Output: Value`]: 5,
        [`${prefix} Protocol Output: Average`]: 'Above',
        [`${prefix} Protocol Output: No. of teams collaborated with`]: 2,
        [`${prefix} Protocol Output: Name of teams collaborated with`]:
          'Team B, Team C',
      });
    },
  );
});
