import {
  TeamProductivityDataObject,
  TeamProductivityPerformance,
  UserProductivityDataObject,
  UserProductivityPerformance,
} from '@asap-hub/model';
import { userProductivityToCSV, teamProductivityToCSV } from '../export';

const performanceMetric = {
  belowAverageMin: 1,
  belowAverageMax: 2,
  averageMin: 2,
  averageMax: 3,
  aboveAverageMin: 3,
  aboveAverageMax: 5,
};

describe('userProductivityToCSV', () => {
  it('handles basic data', () => {
    const data: UserProductivityDataObject = {
      id: '1',
      name: '',
      teams: [
        {
          id: '1',
          role: 'Trainee',
          team: 'Team A',
          isTeamInactive: false,
          isUserInactiveOnTeam: false,
        },
      ],
      isAlumni: false,
      asapPublicOutput: 1,
      asapOutput: 2,
      ratio: '0.5',
    };
    const performance: UserProductivityPerformance = {
      asapOutput: performanceMetric,
      asapPublicOutput: performanceMetric,
      ratio: performanceMetric,
    };

    expect(userProductivityToCSV(performance)(data)).toEqual({
      ASAPOutputAverage: 'Below',
      ASAPOutputValue: 2,
      ASAPPublicOutputAverage: 'Below',
      ASAPPublicOutputValue: 1,
      ratio: '0.5',
      roleA: 'Trainee',
      roleB: '',
      status: 'Active',
      teamA: 'Team A',
      teamB: '',
      user: '',
    });
  });
});

describe('teamProductivityToCSV', () => {
  it('handles basic data', () => {
    const data: TeamProductivityDataObject = {
      id: '1',
      name: 'Team A',
      isInactive: false,
      Article: 1,
      Bioinformatics: 2,
      Dataset: 3,
      'Lab Material': 4,
      Protocol: 5,
    };
    const performance: TeamProductivityPerformance = {
      article: performanceMetric,
      bioinformatics: performanceMetric,
      dataset: performanceMetric,
      labMaterial: performanceMetric,
      protocol: performanceMetric,
    };
    expect(teamProductivityToCSV(performance)(data)).toEqual({
      ASAPALabMaterialAverage: 'Above',
      ASAPALabMaterialValue: 4,
      ASAPArticleOutputAverage: 'Below',
      ASAPArticleOutputValue: 1,
      ASAPBioinformaticOutputAverage: 'Below',
      ASAPBioinformaticOutputValue: 2,
      ASAPDatasetOutputAverage: 'Average',
      ASAPDatasetOutputValue: 3,
      ASAPProtocolAverage: 'Above',
      ASAPProtocolValue: 5,
      status: 'Active',
      team: 'Team A',
    });
  });
});
