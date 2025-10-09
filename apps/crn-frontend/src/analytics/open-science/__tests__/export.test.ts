import {
  PreprintComplianceResponse,
  PublicationComplianceResponse,
} from '@asap-hub/model';
import { preprintComplianceToCSV, publicationComplianceToCSV } from '../export';

describe('preprintComplianceToCSV', () => {
  const defaultPreprintCompliance: PreprintComplianceResponse = {
    teamId: 'team-1',
    teamName: 'Test Team',
    isTeamInactive: false,
    numberOfPreprints: 25,
    numberOfPublications: 20,
    postedPriorPercentage: 75,
    ranking: 'NEEDS IMPROVEMENT',
    timeRange: 'all',
  };

  const defaultCSVData = {
    'Team Name': 'Test Team',
    'Team Status': 'Active',
    'Number of Preprints': 25,
    'Posted Prior to Journal Submission': '75%',
    Ranking: 'Needs Improvement',
  };

  it('exports preprint compliance data for active team with full data', () => {
    expect(preprintComplianceToCSV(defaultPreprintCompliance)).toEqual(
      defaultCSVData,
    );
  });

  it('exports preprint compliance data for inactive team with full data', () => {
    const data: PreprintComplianceResponse = {
      ...defaultPreprintCompliance,
      isTeamInactive: true,
    };

    expect(preprintComplianceToCSV(data)).toEqual({
      ...defaultCSVData,
      'Team Status': 'Inactive',
    });
  });

  it('exports preprint compliance data with limited data', () => {
    const data: PreprintComplianceResponse = {
      ...defaultPreprintCompliance,
      postedPriorPercentage: null,
    };

    expect(preprintComplianceToCSV(data)).toEqual({
      ...defaultCSVData,
      'Posted Prior to Journal Submission': 'N/A',
      Ranking: 'Limited Data',
    });
  });
});

describe('publicationComplianceToCSV', () => {
  const defaultPublicationCompliance: PublicationComplianceResponse = {
    teamId: 'team-1',
    teamName: 'Test Team',
    isTeamInactive: false,
    overallCompliance: 85,
    datasetsPercentage: 80,
    datasetsRanking: 'ADEQUATE',
    protocolsPercentage: 80,
    protocolsRanking: 'ADEQUATE',
    codePercentage: 80,
    codeRanking: 'ADEQUATE',
    labMaterialsPercentage: 80,
    labMaterialsRanking: 'ADEQUATE',
  };

  const defaultCSVData = {
    'Team Name': 'Test Team',
    'Team Status': 'Active',
    Publication: '85%',
    'Publication Ranking': 'Adequate',
    Datasets: '80%',
    'Datasets Ranking': 'Adequate',
    Protocols: '80%',
    'Protocols Ranking': 'Adequate',
    Code: '80%',
    'Code Ranking': 'Adequate',
    'Lab Materials': '80%',
    'Lab Materials Ranking': 'Adequate',
  };

  it('exports publication compliance data for active team with full data', () => {
    expect(publicationComplianceToCSV(defaultPublicationCompliance)).toEqual(
      defaultCSVData,
    );
  });

  it('exports publication compliance data for inactive team with full data', () => {
    const data: PublicationComplianceResponse = {
      ...defaultPublicationCompliance,
      isTeamInactive: true,
    };

    expect(publicationComplianceToCSV(data)).toEqual({
      ...defaultCSVData,
      'Team Status': 'Inactive',
    });
  });

  it('exports publication compliance data with limited data', () => {
    const data: PublicationComplianceResponse = {
      ...defaultPublicationCompliance,
      overallCompliance: null,
      datasetsPercentage: null,
      datasetsRanking: 'LIMITED DATA',
      protocolsPercentage: null,
      protocolsRanking: 'LIMITED DATA',
      codePercentage: null,
      codeRanking: 'LIMITED DATA',
      labMaterialsPercentage: null,
      labMaterialsRanking: 'LIMITED DATA',
    };

    expect(publicationComplianceToCSV(data)).toEqual({
      ...defaultCSVData,
      Publication: 'N/A',
      'Publication Ranking': 'Limited Data',
      Datasets: 'N/A',
      'Datasets Ranking': 'Limited Data',
      Protocols: 'N/A',
      'Protocols Ranking': 'Limited Data',
      Code: 'N/A',
      'Code Ranking': 'Limited Data',
      'Lab Materials': 'N/A',
      'Lab Materials Ranking': 'Limited Data',
    });
  });
});
