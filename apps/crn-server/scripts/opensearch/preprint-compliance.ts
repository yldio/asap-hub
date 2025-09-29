import { fetchAllTeams, readComplianceData } from './shared-utils';

import {
  PREPRINT_COMPLIANCE_SHEET_NAME,
  PREPRINT_COMPLIANCE_HEADER_MAPPINGS,
} from './constants';
import { MetricObject } from './types';

interface SpreadsheetRow {
  Team: string;
  [key: string]: unknown;
}

const readPreprintComplianceData = async (
  environment: 'local' | 'production' = 'production',
): Promise<SpreadsheetRow[]> => {
  const rawData = await readComplianceData(
    PREPRINT_COMPLIANCE_SHEET_NAME,
    environment,
  );
  return rawData as SpreadsheetRow[];
};

const createBasePreprintComplianceMetricObject = (
  team: { id: string; inactiveSince?: string } | null,
  teamName: string,
  timeRange: 'all' | 'last-year',
): MetricObject<'preprint-compliance'> => ({
  teamId: team?.id || '',
  teamName,
  isTeamInactive: !!team?.inactiveSince,
  numberOfPreprints: 0,
  numberOfPublications: 0,
  postedPriorPercentage: 0,
  ranking: '',
  timeRange,
});

const parseTimeRange = (timeRangeStr: string): 'all' | 'last-year' => {
  return timeRangeStr === 'All Time' ? 'all' : 'last-year';
};

const mapSpreadsheetDataToMetrics = (
  rawData: SpreadsheetRow[],
  teams: { id: string; displayName: string; inactiveSince?: string }[],
): Record<'all' | 'last-year', MetricObject<'preprint-compliance'>>[] => {
  const teamLookup = new Map(teams.map((team) => [team.displayName, team]));

  return rawData.map((row) => {
    const teamName = row.Team;
    const team = teamLookup.get(teamName);

    if (!team) {
      console.warn(`Team not found: ${teamName}`);
    }

    const documents: Record<
      'all' | 'last-year',
      MetricObject<'preprint-compliance'>
    > = {
      all: createBasePreprintComplianceMetricObject(
        team || null,
        teamName,
        'all',
      ),
      'last-year': createBasePreprintComplianceMetricObject(
        team || null,
        teamName,
        'last-year',
      ),
    };

    Object.entries(row).forEach(([key, value]) => {
      if (key === 'Team') return;

      const [timeRangeStr, header] = key.split(' - ') as [string, string];
      const timeRange = parseTimeRange(timeRangeStr);
      const fieldName =
        PREPRINT_COMPLIANCE_HEADER_MAPPINGS[
          header as keyof typeof PREPRINT_COMPLIANCE_HEADER_MAPPINGS
        ];

      if (fieldName && documents[timeRange]) {
        if (
          fieldName === 'postedPriorPercentage' &&
          typeof value === 'string'
        ) {
          (documents[timeRange] as Record<string, unknown>)[fieldName] = null;
        } else {
          (documents[timeRange] as Record<string, unknown>)[fieldName] = value;
        }
      }
    });

    return documents;
  });
};

export const exportPreprintComplianceData = async (
  environment: 'local' | 'production' = 'production',
): Promise<MetricObject<'preprint-compliance'>[]> => {
  console.log('Starting preprint compliance data export...');

  const [allTeams, rawData] = await Promise.all([
    fetchAllTeams(),
    readPreprintComplianceData(environment),
  ]);

  console.log(
    `Fetched ${allTeams.length} teams and ${rawData.length} spreadsheet rows`,
  );

  const documents = mapSpreadsheetDataToMetrics(rawData, allTeams);

  const flattenedDocuments = documents.flatMap((document) => [
    document.all,
    document['last-year'],
  ]);

  console.log(
    `Finished exporting ${flattenedDocuments.length} records for preprint-compliance`,
  );

  return flattenedDocuments;
};
