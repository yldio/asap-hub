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
    numberOfPublications: 6,
    overallCompliance: 100,
    numberOfOutputs: 62,
    datasetsPercentage: 100,
    numberOfDatasets: 20,
    datasetsRanking: 'OUTSTANDING',
    numberOfProtocols: 31,
    protocolsPercentage: 100,
    protocolsRanking: 'OUTSTANDING',
    numberOfCode: 11,
    codePercentage: 100,
    codeRanking: 'OUTSTANDING',
    numberOfLabMaterials: 0,
    labMaterialsPercentage: null,
    labMaterialsRanking: 'LIMITED DATA',
  };

  const defaultCSVData = {
    'Team Name': 'Test Team',
    'Team Status': 'Active',
    '# Publications': 6,
    'Publications %': '100%',
    'Publications Ranking': 'Outstanding',
    '# Outputs': 62,
    '# Datasets': 20,
    'Datasets %': '100%',
    'Datasets Ranking': 'Outstanding',
    '# Protocols': 31,
    'Protocols %': '100%',
    'Protocols Ranking': 'Outstanding',
    '# Code': 11,
    'Code %': '100%',
    'Code Ranking': 'Outstanding',
    '# Lab Materials': 0,
    'Lab Materials %': 'N/A',
    'Lab Materials Ranking': 'Limited Data',
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
      numberOfPublications: 0,
      numberOfOutputs: 0,
      numberOfDatasets: 0,
      datasetsPercentage: null,
      datasetsRanking: 'LIMITED DATA',
      numberOfProtocols: 0,
      protocolsPercentage: null,
      protocolsRanking: 'LIMITED DATA',
      numberOfCode: 0,
      codePercentage: null,
      codeRanking: 'LIMITED DATA',
      numberOfLabMaterials: 0,
      labMaterialsPercentage: null,
      labMaterialsRanking: 'LIMITED DATA',
    };

    expect(publicationComplianceToCSV(data)).toEqual({
      ...defaultCSVData,
      'Publications %': 'N/A',
      'Publications Ranking': 'Limited Data',
      '# Publications': 0,
      '# Outputs': 0,
      '# Datasets': 0,
      'Datasets %': 'N/A',
      'Datasets Ranking': 'Limited Data',
      'Protocols %': 'N/A',
      'Protocols Ranking': 'Limited Data',
      '# Protocols': 0,
      'Code %': 'N/A',
      'Code Ranking': 'Limited Data',
      '# Code': 0,
      'Lab Materials %': 'N/A',
      'Lab Materials Ranking': 'Limited Data',
      '# Lab Materials': 0,
    });
  });
});
