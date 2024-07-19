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

  it('exports within-team data', () => {
    expect(userCollaborationToCSV('within-team', performance)(data)).toEqual({
      User: 'Jane Doe',
      'User Status': 'Active',
      'Alumni Since': '',

      'Team A': 'Test 1',
      'Team Status A': 'Active',
      'Team Inactive Since A': '',
      'Role A': 'Key Personnel',
      'User Team Status A': 'Inactive',
      'User Team Inactive Since A': '2024-02-06T00:00:00.000-03:00',
      'Outputs Co-Authored: Value A': 1,
      'Outputs Co-Authored: Average A': 'Below',

      'Team B': 'De Camilli',
      'Team Status B': 'Inactive',
      'Team Inactive Since B': '2024-02-15T00:00:00.000Z',
      'Role B': 'Project Manager',
      'User Team Status B': 'Inactive',
      'User Team Inactive Since B': '',
      'Outputs Co-Authored: Value B': 2,
      'Outputs Co-Authored: Average B': 'Below',

      'Team C': '',
      'Team Status C': '',
      'Team Inactive Since C': '',
      'Role C': '',
      'User Team Status C': '',
      'User Team Inactive Since C': '',
      'Outputs Co-Authored: Value C': '',
      'Outputs Co-Authored: Average C': '',
    });
  });

  it('exports across-teams data', () => {
    expect(userCollaborationToCSV('across-teams', performance)(data)).toEqual({
      User: 'Jane Doe',
      'User Status': 'Active',
      'Alumni Since': '',

      'Team A': 'Test 1',
      'Team Status A': 'Active',
      'Team Inactive Since A': '',
      'Role A': 'Key Personnel',
      'User Team Status A': 'Inactive',
      'User Team Inactive Since A': '2024-02-06T00:00:00.000-03:00',
      'Outputs Co-Authored: Value A': 0,
      'Outputs Co-Authored: Average A': 'Below',

      'Team B': 'De Camilli',
      'Team Status B': 'Inactive',
      'Team Inactive Since B': '2024-02-15T00:00:00.000Z',
      'Role B': 'Project Manager',
      'User Team Status B': 'Inactive',
      'User Team Inactive Since B': '',
      'Outputs Co-Authored: Value B': 1,
      'Outputs Co-Authored: Average B': 'Below',

      'Team C': '',
      'Team Status C': '',
      'Team Inactive Since C': '',
      'Role C': '',
      'User Team Status C': '',
      'User Team Inactive Since C': '',
      'Outputs Co-Authored: Value C': '',
      'Outputs Co-Authored: Average C': '',
    });
  });
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

  it('handles within-team data', () => {
    expect(teamCollaborationWithinTeamToCSV(performance)(data)).toEqual({
      Team: 'Team A',
      'Team Status': 'Active',
      'Inactive Since': '',
      'ASAP Article Output: Value': 3,
      'ASAP Article Output: Average': 'Average',
      'ASAP Bioinformatic Output: Value': 3,
      'ASAP Bioinformatic Output: Average': 'Average',
      'ASAP Dataset Output: Value': 3,
      'ASAP Dataset Output: Average': 'Average',
      'ASAP Lab Resource Output: Value': 3,
      'ASAP Lab Resource Output: Average': 'Average',
      'ASAP Protocol Output: Value': 3,
      'ASAP Protocol Output: Average': 'Average',
    });
  });

  it('handles across-teams data', () => {
    expect(teamCollaborationAcrossTeamToCSV(performance)(data)).toEqual({
      Team: 'Team A',
      'Team Status': 'Active',
      'Inactive Since': '',
      'ASAP Article Output: Value': 5,
      'ASAP Article Output: Average': 'Above',
      'ASAP Output Article: No. of teams collaborated with': 2,
      'ASAP Output Article: Name of teams collaborated with': 'Team B, Team C',
      'ASAP Bioinformatic Output: Value': 5,
      'ASAP Bioinformatic Output: Average': 'Above',
      'ASAP Output Bioinformatics: No. of teams collaborated with': 2,
      'ASAP Output Bioinformatics: Name of teams collaborated with':
        'Team B, Team C',
      'ASAP Dataset Output: Value': 5,
      'ASAP Dataset Output: Average': 'Above',
      'ASAP Output Dataset: No. of teams collaborated with': 2,
      'ASAP Output Dataset: Name of teams collaborated with': 'Team B, Team C',
      'ASAP Lab Resource Output: Value': 5,
      'ASAP Lab Resource Output: Average': 'Above',
      'ASAP Output Lab Resource: No. of teams collaborated with': 2,
      'ASAP Output Lab Resource: Name of teams collaborated with':
        'Team B, Team C',
      'ASAP Protocol Output: Value': 5,
      'ASAP Protocol Output: Average': 'Above',
      'ASAP Output Protocol: No. of teams collaborated with': 2,
      'ASAP Output Protocol: Name of teams collaborated with': 'Team B, Team C',
    });
  });
});
