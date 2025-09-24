/* eslint-disable no-restricted-syntax, no-continue */
import { sheets_v4 as sheetsV4 } from '@googleapis/sheets';
import { GoogleAuth, JWT } from 'google-auth-library';
import { GetJWTCredentials } from './aws-secret-manager';

export interface GoogleSheetsRow {
  [key: string]: string | number | boolean | null;
}

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  range: string;
}

export const parsePreprintSheet = async (
  sheets: sheetsV4.Sheets,
  spreadsheetId: string,
  range: string,
) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    const firstHeaders = rows[0] as string[];
    const secondHeaders = rows[1] as string[];
    const dataRows = rows.slice(2);

    let lastFirstHeaderText = '';
    const headers = secondHeaders.map((secondHeader, index) => {
      if (!firstHeaders[index] && !secondHeader) return '';

      if (!!secondHeader && !!firstHeaders[index]) {
        lastFirstHeaderText = firstHeaders[index] as string;
        return `${firstHeaders[index]} - ${secondHeader}`;
      }

      if (!firstHeaders[index]) {
        return `${lastFirstHeaderText} - ${secondHeader}`;
      }

      lastFirstHeaderText = firstHeaders[index] as string;
      return lastFirstHeaderText;
    });

    const result = [];
    for (const row of dataRows) {
      const rowData: GoogleSheetsRow = {};
      for (let index = 0; index < headers.length; index += 1) {
        const header = headers[index];
        if (!header) continue;

        if (header === 'Team' && (!row[index] || row[index] === '')) {
          break;
        }

        const value = row[index] || '';
        if (value === '') {
          rowData[header] = null;
        } else if (value === 'TRUE' || value === 'true') {
          rowData[header] = true;
        } else if (value === 'FALSE' || value === 'false') {
          rowData[header] = false;
        } else if (!Number.isNaN(Number(value)) && value !== '') {
          rowData[header] = Number(value);
        } else {
          rowData[header] = value;
        }
      }

      if (Object.keys(rowData).length === 0) {
        break;
      }

      result.push(rowData);
    }
    return result;
  } catch (error) {
    throw new Error(`Failed to read Google Sheets data: ${error}`);
  }
};

export const extractSpreadsheetIdFromUrl = (url: string): string => {
  const patterns = [
    /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/,
    /\/d\/([a-zA-Z0-9-_]+)/,
    /id=([a-zA-Z0-9-_]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  throw new Error(`Could not extract spreadsheet ID from URL: ${url}`);
};

/* istanbul ignore next */
export const getLocalSheetsClient = async () => {
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountKey) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY is not set');
  }

  const credentials = JSON.parse(serviceAccountKey);
  const auth = new GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  return new sheetsV4.Sheets({ auth });
};

/* istanbul ignore next */
export const getSheetsClient = async (getJWTCredentials: GetJWTCredentials) => {
  const creds = await getJWTCredentials();
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  }).fromJSON(creds) as JWT;

  return new sheetsV4.Sheets({ auth });
};

/* istanbul ignore next */
export const readGoogleSheetsDataLocal = async (
  spreadsheetId: string,
  range: string = 'A:Z',
): Promise<GoogleSheetsRow[]> => {
  const sheets = await getLocalSheetsClient();
  return parsePreprintSheet(sheets, spreadsheetId, range);
};

/* istanbul ignore next */
export const readGoogleSheetsData = async (
  getJWTCredentials: GetJWTCredentials,
  config: GoogleSheetsConfig,
): Promise<GoogleSheetsRow[]> => {
  const sheets = await getSheetsClient(getJWTCredentials);
  return parsePreprintSheet(sheets, config.spreadsheetId, config.range);
};
