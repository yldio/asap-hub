import {
  awsRegion,
  googleApiCredentialsSecretId,
  opensearchAnalyticsSpreadsheetUrl,
} from '../../src/config';
import {
  extractSpreadsheetIdFromUrl,
  getJWTCredentialsFactory,
  readGoogleSheetsData,
  readGoogleSheetsDataLocal,
} from '@asap-hub/server-common';
import TeamController from '../../src/controllers/team.controller';
import { getTeamDataProvider } from '../../src/dependencies/team.dependencies';
import { BATCH_SIZE, SHEET_RANGE } from './constants';

export const fetchAllTeams = async () => {
  try {
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
  } catch (error) {
    console.warn(
      'Failed to fetch teams from Contentful, using empty team list:',
      error,
    );
    return [];
  }
};

export const readComplianceData = async (
  sheetName: string,
  environment: 'local' | 'production' = 'production',
): Promise<Record<string, unknown>[]> => {
  const spreadsheetId = extractSpreadsheetIdFromUrl(
    opensearchAnalyticsSpreadsheetUrl,
  );

  if (environment === 'local') {
    const rawData = await readGoogleSheetsDataLocal(
      spreadsheetId,
      `${sheetName}!${SHEET_RANGE}`,
    );
    return rawData as Record<string, unknown>[];
  }

  const getJWTCredentials = getJWTCredentialsFactory({
    googleApiCredentialsSecretId,
    region: awsRegion,
  });

  const rawData = await readGoogleSheetsData(getJWTCredentials, {
    spreadsheetId,
    range: `${sheetName}!${SHEET_RANGE}`,
  });

  return rawData as Record<string, unknown>[];
};
