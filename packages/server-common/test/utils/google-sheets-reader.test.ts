import { sheets_v4 as sheetsV4 } from '@googleapis/sheets';
import {
  parseComplianceSheet,
  extractSpreadsheetIdFromUrl,
} from '../../src/utils/google-sheets-reader';

jest.mock('@googleapis/sheets');
jest.mock('google-auth-library', () => ({
  ...jest.requireActual('google-auth-library'),
  GoogleAuth: jest.fn(),
  JWT: jest.fn(),
}));
jest.mock('../../src/utils/aws-secret-manager');

describe('Google Sheets Reader', () => {
  const mockSheetsClient = {
    spreadsheets: {
      values: {
        get: jest.fn(),
      },
    },
  } as unknown as sheetsV4.Sheets;

  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  });

  describe('parseComplianceSheet', () => {
    const mockSpreadsheetId = 'test-spreadsheet-id';
    const mockRange = 'A1:Z100';

    const mockGetValues = (values?: string[][]) => {
      mockSheetsClient.spreadsheets.values.get = jest
        .fn()
        .mockResolvedValue({ data: { values } });
    };

    const runParse = async (values?: string[][]) => {
      mockGetValues(values);
      return parseComplianceSheet(
        mockSheetsClient,
        mockSpreadsheetId,
        mockRange,
      );
    };

    it('should parse sheet data with two header rows correctly', async () => {
      const result = await runParse([
        ['Team', 'All Time', 'All Time'],
        ['', '# preprints', '# publications'],
        ['Alessi', '24', '22'],
        ['ASAP', '5', '2'],
      ]);

      expect(mockSheetsClient.spreadsheets.values.get).toHaveBeenCalledWith({
        spreadsheetId: mockSpreadsheetId,
        range: mockRange,
      });

      expect(result).toEqual([
        {
          Team: 'Alessi',
          'All Time - # preprints': 24,
          'All Time - # publications': 22,
        },
        {
          Team: 'ASAP',
          'All Time - # preprints': 5,
          'All Time - # publications': 2,
        },
      ]);
    });

    it('should handle empty first header by using last first header text', async () => {
      const result = await runParse([
        ['Team', 'All Time', ''],
        ['', '# preprints', '# publications'],
        ['Alessi', '24', '22'],
      ]);

      expect(result).toEqual([
        {
          Team: 'Alessi',
          'All Time - # preprints': 24,
          'All Time - # publications': 22,
        },
      ]);
    });

    it('should handle empty second header by using first header only', async () => {
      const result = await runParse([
        ['Team', 'All Time', ''],
        ['', '# preprints', '# publications'],
        ['Alessi', '24', '22'],
      ]);
      expect(result).toEqual([
        {
          Team: 'Alessi',
          'All Time - # preprints': 24,
          'All Time - # publications': 22,
        },
      ]);
    });

    it('should convert boolean values correctly', async () => {
      const result = await runParse([
        ['Boolean Field'],
        ['Boolean'],
        ['TRUE'],
        ['FALSE'],
        ['true'],
        ['false'],
      ]);

      expect(result).toEqual([
        { 'Boolean Field - Boolean': true },
        { 'Boolean Field - Boolean': false },
        { 'Boolean Field - Boolean': true },
        { 'Boolean Field - Boolean': false },
      ]);
    });

    it('should convert numeric values correctly', async () => {
      const result = await runParse([
        ['Number Field'],
        ['Number'],
        ['123'],
        ['45.67'],
        ['0'],
      ]);

      expect(result).toEqual([
        { 'Number Field - Number': 123 },
        { 'Number Field - Number': 45.67 },
        { 'Number Field - Number': 0 },
      ]);
    });

    it('should handle empty values as null', async () => {
      const result = await runParse([
        ['Team', 'All Time'],
        ['', '# preprints'],
        ['Team 1', ''],
        ['Team 2', '8'],
      ]);

      expect(result).toEqual([
        { Team: 'Team 1', 'All Time - # preprints': null },
        { Team: 'Team 2', 'All Time - # preprints': 8 },
      ]);
    });

    it('should break when Team field is empty and Team header is on the first row', async () => {
      const result = await runParse([
        ['Team', 'All Time'],
        ['', '# preprints'],
        ['Team1', '10'],
        ['', ''],
        ['OUTSTANDING', '90'],
      ]);

      expect(result).toEqual([{ Team: 'Team1', 'All Time - # preprints': 10 }]);
    });

    it('should break when Team field is empty and Team header is on the second row', async () => {
      const result = await runParse([
        ['', 'All Time'],
        ['Team', '# publications'],
        ['ASAP', '9'],
        ['', ''],
        ['ADEQUATE', '82'],
      ]);

      expect(result).toEqual([
        { ' - Team': 'ASAP', 'All Time - # publications': 9 },
      ]);
    });

    it('should skip when headers are empty', async () => {
      const result = await runParse([
        ['Team', 'All Time', '', 'Last Year'],
        ['', '# preprints', '', '# preprints'],
        ['Team1', '10', '', '5'],
      ]);

      expect(result).toEqual([
        {
          Team: 'Team1',
          'All Time - # preprints': 10,
          'Last Year - # preprints': 5,
        },
      ]);
    });

    it('should return empty array when no rows are returned', async () => {
      const result = await runParse(undefined);

      expect(result).toEqual([]);
    });

    it('should return empty array when empty rows are returned', async () => {
      const result = await runParse([]);

      expect(result).toEqual([]);
    });

    it('should throw error when API call fails', async () => {
      const error = new Error('API Error');
      mockSheetsClient.spreadsheets.values.get = jest
        .fn()
        .mockRejectedValue(error);

      await expect(
        parseComplianceSheet(mockSheetsClient, mockSpreadsheetId, mockRange),
      ).rejects.toThrow('Failed to read Google Sheets data: Error: API Error');
    });
  });

  describe('extractSpreadsheetIdFromUrl', () => {
    it('should extract ID from standard Google Sheets URL', () => {
      const url =
        'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit';
      const result = extractSpreadsheetIdFromUrl(url);
      expect(result).toBe('1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms');
    });

    it('should extract ID from URL with /d/ pattern', () => {
      const url =
        'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms';
      const result = extractSpreadsheetIdFromUrl(url);
      expect(result).toBe('1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms');
    });

    it('should extract ID from URL with id= parameter', () => {
      const url =
        'https://docs.google.com/spreadsheets/edit?id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms';
      const result = extractSpreadsheetIdFromUrl(url);
      expect(result).toBe('1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms');
    });

    it('should handle URLs with additional parameters', () => {
      const url =
        'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0';
      const result = extractSpreadsheetIdFromUrl(url);
      expect(result).toBe('1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms');
    });

    it('should handle URLs with query parameters', () => {
      const url =
        'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing';
      const result = extractSpreadsheetIdFromUrl(url);
      expect(result).toBe('1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms');
    });

    it('should handle URLs with hyphens and underscores in ID', () => {
      const url =
        'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms-abc_123/edit';
      const result = extractSpreadsheetIdFromUrl(url);
      expect(result).toBe(
        '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms-abc_123',
      );
    });

    it('should throw error for invalid URL', () => {
      const url = 'https://invalid-url.com';
      expect(() => extractSpreadsheetIdFromUrl(url)).toThrow(
        'Could not extract spreadsheet ID from URL: https://invalid-url.com',
      );
    });

    it('should throw error for empty URL', () => {
      const url = '';
      expect(() => extractSpreadsheetIdFromUrl(url)).toThrow(
        'Could not extract spreadsheet ID from URL: ',
      );
    });

    it('should throw error for URL without spreadsheet ID', () => {
      const url = 'https://docs.google.com/spreadsheets/';
      expect(() => extractSpreadsheetIdFromUrl(url)).toThrow(
        'Could not extract spreadsheet ID from URL: https://docs.google.com/spreadsheets/',
      );
    });
  });
});
