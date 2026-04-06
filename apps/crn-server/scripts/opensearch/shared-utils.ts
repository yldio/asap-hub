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

/**
 * Parse a numeric value coming from a Google Sheets compliance row.
 *
 * The compliance spreadsheets store percentages as strings like "98.82%" and
 * use sentinel strings like "Limited Data" or "NA" to indicate missing values.
 * Plain numbers can also come through directly when the cell is numeric.
 *
 * Returns the numeric value, or null if the value is missing/non-numeric.
 */
export const parseComplianceNumericValue = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim().replace(/%$/, '');
    if (trimmed === '') {
      return null;
    }
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

export const extractDOIs = (
  items: Array<{ doi?: string | null } | null> | undefined,
): string =>
  [
    ...new Set(
      (items ?? [])
        .map((item) => item?.doi?.trim())
        .filter(Boolean) as string[],
    ),
  ].join(',');

type PagedResult<T> = {
  total?: number;
  items: T[];
};

export const paginate = async <T>(
  fetchPage: (params: {
    limit: number;
    skip: number;
  }) => Promise<PagedResult<T>>,
  pageSize: number,
): Promise<T[]> => {
  const results: T[] = [];
  let skip = 0;
  let total = 0;

  do {
    const { total: pageTotal, items } = await fetchPage({
      limit: pageSize,
      skip,
    });
    total = pageTotal ?? 0;
    results.push(...items);
    skip += pageSize;
  } while (skip < total);

  if (results.length === 0) {
    console.warn('paginate: no results returned for query.');
  }

  return results;
};
