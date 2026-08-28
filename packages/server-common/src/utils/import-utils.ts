/* eslint-disable no-restricted-syntax */
import {
  type Entry,
  getRestClient,
  type Environment,
} from '@asap-hub/contentful';
import csvParse from 'csv-parse';
import fs from 'fs';

export type ContentfulEntryLookup = {
  id: string;
  entry: Entry;
};

export const NON_ARCHIVED_ENTRY_QUERY = {
  'sys.archivedAt[exists]': false,
} as const;

/** Reads a CSV file and returns trimmed headers plus raw rows. */
export const readCsv = (
  filePath: string,
): Promise<{ headers: string[]; rows: string[][] }> =>
  new Promise((resolve, reject) => {
    const rows: string[][] = [];
    let headers: string[] = [];
    const parser = csvParse({ relax_column_count: true });

    fs.createReadStream(filePath)
      .pipe(parser)
      .on('data', (row: string[]) => {
        if (headers.length === 0) {
          headers = row.map((h: string) => h.trim());
        } else {
          rows.push(row);
        }
      })
      .on('end', () => resolve({ headers, rows }))
      .on('error', reject);
  });

export const col = (headers: string[], name: string): number => {
  const idx = headers.indexOf(name);
  // In practice should not happen because we have validated the headers at the very
  // beggining, but just in case...
  if (idx === -1) {
    throw new Error(
      `CSV column "${name}" not found. Available: ${headers.join(', ')}`,
    );
  }
  return idx;
};

export const validateRequiredColumns = (
  headers: string[],
  requiredColumns: readonly string[],
): void => {
  for (const columnName of requiredColumns) {
    col(headers, columnName);
  }
};

export const cell = (row: string[], index: number): string =>
  (row[index] || '').trim();

export const isEmptyRow = (row: string[]): boolean =>
  row.every((value) => !value || value.trim() === '');

/** Creates a rate-limited Contentful environment client from env vars. */
export const getContentfulEnvironment = async (): Promise<Environment> => {
  const accessToken = process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN;
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const envId = process.env.CONTENTFUL_ENV_ID;

  if (!accessToken || !spaceId || !envId) {
    throw new Error(
      'Missing env vars: CONTENTFUL_MANAGEMENT_ACCESS_TOKEN, CONTENTFUL_SPACE_ID, CONTENTFUL_ENV_ID',
    );
  }

  // eslint-disable-next-line no-console
  console.log(
    `Connecting to Contentful environment: ${envId} (using safe rate-limited client)`,
  );
  return getRestClient({
    space: spaceId,
    accessToken,
    environment: envId,
  });
};

export const findUserByEmailCaseInsensitive = async (
  env: Environment,
  email: string,
): Promise<ContentfulEntryLookup | null> => {
  const normalizedEmail = email.toLowerCase();
  const entries = await env.getEntries({
    ...NON_ARCHIVED_ENTRY_QUERY,
    content_type: 'users',
    'fields.email[match]': normalizedEmail,
    limit: 10,
  });

  const match = entries.items.find(
    (item) =>
      (
        (item.fields?.email?.['en-US'] as string | undefined) || ''
      ).toLowerCase() === normalizedEmail,
  );

  if (!match) {
    return null;
  }
  return { id: match.sys.id, entry: match };
};
