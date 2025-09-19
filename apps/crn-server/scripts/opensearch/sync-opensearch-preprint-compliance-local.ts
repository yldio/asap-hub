import {
  awsRegion,
  environment,
  googleApiCredentialsSecretId,
  opensearchAnalyticsSpreadsheetUrl,
  opensearchPassword,
  opensearchUsername,
} from '../../src/config';
import {
  extractSpreadsheetIdFromUrl,
  getJWTCredentialsFactory,
  indexOpensearchData,
  readGoogleSheetsData,
  readGoogleSheetsDataLocal,
} from '@asap-hub/server-common';
import TeamController from '../../src/controllers/team.controller';
import { getTeamDataProvider } from '../../src/dependencies/team.dependencies';

import {
  PREPRINT_COMPLIANCE_SHEET_NAME,
  SHEET_RANGE,
  PREPRINT_COMPLIANCE_HEADER_MAPPINGS,
  BATCH_SIZE,
  metricConfig,
} from './constants';
import { MetricObject } from './types';

interface SpreadsheetRow {
  Team: string;
  [key: string]: unknown;
}

const fetchAllTeams = async () => {
  const teamController = new TeamController(getTeamDataProvider());

  const initialResponse = await teamController.fetch({
    take: BATCH_SIZE,
    skip: 0,
  });

  const allTeams = [...initialResponse.items];
  const total = initialResponse.total;

  for (let skip = BATCH_SIZE; skip < total; skip += BATCH_SIZE) {
    const response = await teamController.fetch({
      take: BATCH_SIZE,
      skip,
    });
    allTeams.push(...response.items);
  }

  return allTeams;
};

const readPreprintComplianceData = async (
  environment: 'local' | 'production' = 'production',
): Promise<SpreadsheetRow[]> => {
  const spreadsheetId = extractSpreadsheetIdFromUrl(
    opensearchAnalyticsSpreadsheetUrl,
  );

  if (environment === 'local') {
    const rawData = await readGoogleSheetsDataLocal(
      spreadsheetId,
      `${PREPRINT_COMPLIANCE_SHEET_NAME}!${SHEET_RANGE}`,
    );
    return rawData as SpreadsheetRow[];
  }

  const getJWTCredentials = getJWTCredentialsFactory({
    googleApiCredentialsSecretId,
    region: awsRegion,
  });

  const rawData = await readGoogleSheetsData(getJWTCredentials, {
    spreadsheetId,
    range: `${PREPRINT_COMPLIANCE_SHEET_NAME}!${SHEET_RANGE}`,
  });

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

const exportPreprintComplianceToOpensearch = async () => {
  console.log(`Starting export for metric: preprint-compliance`);

  const config = metricConfig['preprint-compliance'];

  const documents = await exportPreprintComplianceData('local');

  await indexOpensearchData({
    awsRegion,
    stage: environment,
    opensearchUsername,
    opensearchPassword,
    indexAlias: config.indexAlias,
    getData: async () => ({
      documents,
      mapping: config.mapping,
    }),
  });

  console.log(
    `Successfully indexed ${documents.length} documents for metric: preprint-compliance`,
  );
};

const run = async () => {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    console.log('Environment variables needed:');
    console.log(
      '- GOOGLE_SERVICE_ACCOUNT_KEY: JSON string with service account credentials',
    );
    process.exit(1);
  }

  try {
    await exportPreprintComplianceToOpensearch();
    console.log('Preprint compliance data exported successfully!');
  } catch (error) {
    console.error('Error exporting preprint compliance data:', error);
    process.exit(1);
  }
};

run();
