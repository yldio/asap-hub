import { fetchAllTeams, readComplianceData } from './shared-utils';

import {
  PUBLICATION_COMPLIANCE_ALL_TIME_SHEET_NAME,
  PUBLICATION_COMPLIANCE_LAST_12_MONTHS_SHEET_NAME,
  PUBLICATION_COMPLIANCE_HEADER_MAPPINGS,
} from './constants';
import { MetricObject } from './types';

interface SpreadsheetRow {
  ' - Team': string;
  [key: string]: unknown;
}

const readPublicationComplianceData = async (
  sheetName: string,
  environment: 'local' | 'production' = 'production',
): Promise<SpreadsheetRow[]> => {
  const rawData = await readComplianceData(sheetName, environment);
  return rawData as SpreadsheetRow[];
};

const createBasePublicationComplianceMetricObject = (
  team: { id: string; inactiveSince?: string } | null,
  teamName: string,
  timeRange: 'all' | 'last-year',
): MetricObject<'publication-compliance'> => ({
  teamId: team?.id || '',
  teamName,
  isTeamInactive: !!team?.inactiveSince,
  overallCompliance: 0,
  ranking: '',
  datasetsPercentage: 0,
  datasetsRanking: '',
  protocolsPercentage: 0,
  protocolsRanking: '',
  codePercentage: 0,
  codeRanking: '',
  labMaterialsPercentage: 0,
  labMaterialsRanking: '',
  numberOfPublications: 0,
  numberOfOutputs: 0,
  numberOfDatasets: 0,
  numberOfProtocols: 0,
  numberOfCode: 0,
  numberOfLabMaterials: 0,
  timeRange,
});

const mapSpreadsheetDataToMetrics = (
  rawData: SpreadsheetRow[],
  teams: { id: string; displayName: string; inactiveSince?: string }[],
  timeRange: 'all' | 'last-year',
): MetricObject<'publication-compliance'>[] => {
  const teamLookup = new Map(teams.map((team) => [team.displayName, team]));

  return rawData
    .filter((row) => {
      const teamName = row[' - Team'];
      return teamName && teamName !== '';
    })
    .map((row) => {
      const teamName = row[' - Team'];
      const team = teamLookup.get(teamName);

      if (!team) {
        console.warn(
          `Team not found: ${teamName} - will create document with empty teamId`,
        );
      }

      const document = createBasePublicationComplianceMetricObject(
        team || null,
        teamName,
        timeRange,
      );

      Object.entries(row).forEach(([key, value]) => {
        if (key === ' - Team') return;

        const fieldName =
          PUBLICATION_COMPLIANCE_HEADER_MAPPINGS[
            key as keyof typeof PUBLICATION_COMPLIANCE_HEADER_MAPPINGS
          ];

        if (fieldName) {
          // Handle fields that might be strings like "NA" or null/undefined
          if (value === 'NA' || value === null || value === undefined) {
            (document as Record<string, unknown>)[fieldName] = null;
          } else {
            (document as Record<string, unknown>)[fieldName] = value;
          }
        }
      });

      return document;
    });
};

export const exportPublicationComplianceData = async (
  environment: 'local' | 'production' = 'production',
): Promise<MetricObject<'publication-compliance'>[]> => {
  console.log('Starting publication compliance data export...');

  const [allTeams, allTimeData, last12MonthsData] = await Promise.all([
    fetchAllTeams(),
    readPublicationComplianceData(
      PUBLICATION_COMPLIANCE_ALL_TIME_SHEET_NAME,
      environment,
    ),
    readPublicationComplianceData(
      PUBLICATION_COMPLIANCE_LAST_12_MONTHS_SHEET_NAME,
      environment,
    ),
  ]);

  console.log(
    `Fetched ${allTeams.length} teams, ${allTimeData.length} all-time rows, and ${last12MonthsData.length} last-12-months rows`,
  );

  // Debug: Show what team names are in the spreadsheet
  console.log('First few rows of all-time data:', allTimeData.slice(0, 3));
  console.log(
    'First few rows of last-12-months data:',
    last12MonthsData.slice(0, 3),
  );

  const allTimeTeamNames = allTimeData
    .map((row) => row[' - Team'])
    .filter((teamName) => teamName && teamName !== '');
  const last12MonthsTeamNames = last12MonthsData
    .map((row) => row[' - Team'])
    .filter((teamName) => teamName && teamName !== '');

  console.log(
    'Sample team names from all-time data:',
    allTimeTeamNames.slice(0, 5),
  );
  console.log(
    'Sample team names from last-12-months data:',
    last12MonthsTeamNames.slice(0, 5),
  );
  console.log(
    'Total unique team names in all-time:',
    new Set(allTimeTeamNames).size,
  );
  console.log(
    'Total unique team names in last-12-months:',
    new Set(last12MonthsTeamNames).size,
  );

  const allTimeDocuments = mapSpreadsheetDataToMetrics(
    allTimeData,
    allTeams,
    'all',
  );
  const last12MonthsDocuments = mapSpreadsheetDataToMetrics(
    last12MonthsData,
    allTeams,
    'last-year',
  );

  const allDocuments = [...allTimeDocuments, ...last12MonthsDocuments];

  console.log(
    `Finished exporting ${allDocuments.length} records for publication-compliance`,
  );

  return allDocuments;
};
