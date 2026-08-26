import { getRestClient, type Environment } from '@asap-hub/contentful';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  cell,
  col,
  findUserByEmailCaseInsensitive,
  getContentfulEnvironment,
  isEmptyRow,
  NON_ARCHIVED_ENTRY_QUERY,
  readCsv,
  validateRequiredColumns,
} from '../../src/utils/import-utils';

jest.mock('@asap-hub/contentful', () => ({
  ...jest.requireActual('@asap-hub/contentful'),
  getRestClient: jest.fn(),
}));

const mockGetRestClient = getRestClient as jest.MockedFunction<
  typeof getRestClient
>;

describe('import-utils', () => {
  describe('col', () => {
    const headers = ['First name', 'Last name', 'Email address'];

    it('returns the index of a matching column', () => {
      expect(col(headers, 'First name')).toBe(0);
      expect(col(headers, 'Email address')).toBe(2);
    });

    it('throws when the column is missing', () => {
      expect(() => col(headers, 'ORCID')).toThrow(
        'CSV column "ORCID" not found. Available: First name, Last name, Email address',
      );
    });
  });

  describe('validateRequiredColumns', () => {
    const headers = ['First name', 'Last name', 'Email address'];

    it('does not throw when all required columns are present', () => {
      expect(() =>
        validateRequiredColumns(headers, ['First name', 'Email address']),
      ).not.toThrow();
    });

    it('throws for the first missing required column', () => {
      expect(() =>
        validateRequiredColumns(headers, ['First name', 'ORCID', 'Missing']),
      ).toThrow('CSV column "ORCID" not found');
    });
  });

  describe('cell', () => {
    it('trims the value at the given index', () => {
      expect(cell(['  Ada  ', 'Lovelace'], 0)).toBe('Ada');
    });

    it('returns an empty string for a missing index', () => {
      expect(cell(['Ada'], 5)).toBe('');
    });

    it('returns an empty string for an undefined value', () => {
      expect(cell([undefined as unknown as string], 0)).toBe('');
    });
  });

  describe('isEmptyRow', () => {
    it('returns true for a row of empty or whitespace-only values', () => {
      expect(isEmptyRow(['', '   ', ''])).toBe(true);
    });

    it('returns true for an empty array', () => {
      expect(isEmptyRow([])).toBe(true);
    });

    it('returns false when any value has content', () => {
      expect(isEmptyRow(['', 'Ada', '  '])).toBe(false);
    });
  });

  describe('NON_ARCHIVED_ENTRY_QUERY', () => {
    it('filters out archived entries', () => {
      expect(NON_ARCHIVED_ENTRY_QUERY).toEqual({
        'sys.archivedAt[exists]': false,
      });
    });
  });

  describe('readCsv', () => {
    let tmpDir: string;

    beforeEach(() => {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'import-utils-'));
    });

    afterEach(() => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    const writeCsv = (contents: string): string => {
      const filePath = path.join(tmpDir, 'data.csv');
      fs.writeFileSync(filePath, contents);
      return filePath;
    };

    it('parses trimmed headers and raw rows', async () => {
      const filePath = writeCsv(
        '  First name , Last name \nAda,Lovelace\nAlan,Turing\n',
      );

      const { headers, rows } = await readCsv(filePath);

      expect(headers).toEqual(['First name', 'Last name']);
      expect(rows).toEqual([
        ['Ada', 'Lovelace'],
        ['Alan', 'Turing'],
      ]);
    });

    it('returns no rows when the file only has headers', async () => {
      const filePath = writeCsv('First name,Last name\n');

      const { headers, rows } = await readCsv(filePath);

      expect(headers).toEqual(['First name', 'Last name']);
      expect(rows).toEqual([]);
    });

    it('tolerates rows with an inconsistent column count', async () => {
      const filePath = writeCsv('a,b,c\n1,2\n3,4,5,6\n');

      const { rows } = await readCsv(filePath);

      expect(rows).toEqual([
        ['1', '2'],
        ['3', '4', '5', '6'],
      ]);
    });
  });

  describe('getContentfulEnvironment', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.clearAllMocks();
      process.env = { ...originalEnv };
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    it('creates a rest client from the Contentful env vars', async () => {
      process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN = 'access-token';
      process.env.CONTENTFUL_SPACE_ID = 'space-id';
      process.env.CONTENTFUL_ENV_ID = 'env-id';

      const environment = { id: 'env' } as unknown as Environment;
      mockGetRestClient.mockResolvedValueOnce(environment);

      const result = await getContentfulEnvironment();

      expect(mockGetRestClient).toHaveBeenCalledWith({
        space: 'space-id',
        accessToken: 'access-token',
        environment: 'env-id',
      });
      expect(result).toBe(environment);
    });

    it.each([
      'CONTENTFUL_MANAGEMENT_ACCESS_TOKEN',
      'CONTENTFUL_SPACE_ID',
      'CONTENTFUL_ENV_ID',
    ])('throws when %s is missing', async (missingVar) => {
      process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN = 'access-token';
      process.env.CONTENTFUL_SPACE_ID = 'space-id';
      process.env.CONTENTFUL_ENV_ID = 'env-id';
      delete process.env[missingVar];

      await expect(getContentfulEnvironment()).rejects.toThrow(
        'Missing env vars',
      );
      expect(mockGetRestClient).not.toHaveBeenCalled();
    });
  });

  describe('findUserByEmailCaseInsensitive', () => {
    const buildEnv = (
      items: Array<{ id: string; email?: string }>,
    ): { env: Environment; getEntries: jest.Mock } => {
      const getEntries = jest.fn().mockResolvedValue({
        items: items.map(({ id, email }) => ({
          sys: { id },
          fields: email === undefined ? {} : { email: { 'en-US': email } },
        })),
      });
      return { env: { getEntries } as unknown as Environment, getEntries };
    };

    it('queries non-archived users by normalized email', async () => {
      const { env, getEntries } = buildEnv([
        { id: 'user-1', email: 'ada@example.com' },
      ]);

      await findUserByEmailCaseInsensitive(env, 'ADA@Example.com');

      expect(getEntries).toHaveBeenCalledWith({
        ...NON_ARCHIVED_ENTRY_QUERY,
        content_type: 'users',
        'fields.email[match]': 'ada@example.com',
        limit: 10,
      });
    });

    it('returns the entry whose email matches case-insensitively', async () => {
      const { env } = buildEnv([
        { id: 'user-1', email: 'someone-else@example.com' },
        { id: 'user-2', email: 'ADA@Example.com' },
      ]);

      const result = await findUserByEmailCaseInsensitive(
        env,
        'ada@example.com',
      );

      expect(result).toEqual({
        id: 'user-2',
        entry: expect.objectContaining({ sys: { id: 'user-2' } }),
      });
    });

    it('returns null when no email matches exactly after normalization', async () => {
      const { env } = buildEnv([
        { id: 'user-1', email: 'ada.lovelace@example.com' },
      ]);

      const result = await findUserByEmailCaseInsensitive(
        env,
        'ada@example.com',
      );

      expect(result).toBeNull();
    });

    it('ignores entries without an email field', async () => {
      const { env } = buildEnv([{ id: 'user-1' }]);

      const result = await findUserByEmailCaseInsensitive(
        env,
        'ada@example.com',
      );

      expect(result).toBeNull();
    });
  });
});
