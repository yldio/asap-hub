import { sheets_v4 as sheetsV4 } from '@googleapis/sheets';
import {
  parsePreprintSheet,
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

  describe('parsePreprintSheet', () => {
    const mockSpreadsheetId = 'test-spreadsheet-id';
    const mockRange = 'A1:Z100';

    it('should parse sheet data with two header rows correctly', async () => {
      const mockResponse = {
        data: {
          values: [
            ['Team', 'All Time', 'All Time'],
            ['', '# preprints', '# publications'],
            ['Alessi', '24', '22'],
            ['ASAP', '5', '2'],
          ],
        },
      };

      mockSheetsClient.spreadsheets.values.get = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const result = await parsePreprintSheet(
        mockSheetsClient,
        mockSpreadsheetId,
        mockRange,
      );

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
      const mockResponse = {
        data: {
          values: [
            ['Team', 'All Time', ''],
            ['', '# preprints', '# publications'],
            ['Alessi', '24', '22'],
          ],
        },
      };

      mockSheetsClient.spreadsheets.values.get = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const result = await parsePreprintSheet(
        mockSheetsClient,
        mockSpreadsheetId,
        mockRange,
      );

      expect(result).toEqual([
        {
          Team: 'Alessi',
          'All Time - # preprints': 24,
          'All Time - # publications': 22,
        },
      ]);
    });

    it('should handle empty second header by using first header only', async () => {
      const mockResponse = {
        data: {
          values: [
            ['Team', 'All Time', ''],
            ['', '# preprints', '# publications'],
            ['Alessi', '24', '22'],
          ],
        },
      };

      mockSheetsClient.spreadsheets.values.get = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const result = await parsePreprintSheet(
        mockSheetsClient,
        mockSpreadsheetId,
        mockRange,
      );

      expect(result).toEqual([
        {
          Team: 'Alessi',
          'All Time - # preprints': 24,
          'All Time - # publications': 22,
        },
      ]);
    });

    it('should convert boolean values correctly', async () => {
      const mockResponse = {
        data: {
          values: [
            ['Boolean Field'],
            ['Boolean'],
            ['TRUE'],
            ['FALSE'],
            ['true'],
            ['false'],
          ],
        },
      };

      mockSheetsClient.spreadsheets.values.get = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const result = await parsePreprintSheet(
        mockSheetsClient,
        mockSpreadsheetId,
        mockRange,
      );

      expect(result).toEqual([
        { 'Boolean Field - Boolean': true },
        { 'Boolean Field - Boolean': false },
        { 'Boolean Field - Boolean': true },
        { 'Boolean Field - Boolean': false },
      ]);
    });

    it('should convert numeric values correctly', async () => {
      const mockResponse = {
        data: {
          values: [['Number Field'], ['Number'], ['123'], ['45.67'], ['0']],
        },
      };

      mockSheetsClient.spreadsheets.values.get = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const result = await parsePreprintSheet(
        mockSheetsClient,
        mockSpreadsheetId,
        mockRange,
      );

      expect(result).toEqual([
        { 'Number Field - Number': 123 },
        { 'Number Field - Number': 45.67 },
        { 'Number Field - Number': 0 },
      ]);
    });

    it('should handle empty values as null', async () => {
      const mockResponse = {
        data: {
          values: [
            ['Team', 'All Time'],
            ['', '# preprints'],
            ['Team 1', ''],
            ['Team 2', '8'],
          ],
        },
      };

      mockSheetsClient.spreadsheets.values.get = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const result = await parsePreprintSheet(
        mockSheetsClient,
        mockSpreadsheetId,
        mockRange,
      );

      expect(result).toEqual([
        { Team: 'Team 1', 'All Time - # preprints': null },
        { Team: 'Team 2', 'All Time - # preprints': 8 },
      ]);
    });

    it('should break when Team field is empty', async () => {
      const mockResponse = {
        data: {
          values: [
            ['Team', 'All Time'],
            ['', '# preprints'],
            ['Team1', '10'],
            ['', ''],
            ['OUTSTANDING', '90'],
          ],
        },
      };

      mockSheetsClient.spreadsheets.values.get = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const result = await parsePreprintSheet(
        mockSheetsClient,
        mockSpreadsheetId,
        mockRange,
      );

      expect(result).toEqual([{ Team: 'Team1', 'All Time - # preprints': 10 }]);
    });

    it('should skip when headers are empty', async () => {
      const mockResponse = {
        data: {
          values: [
            ['Team', 'All Time', '', 'Last Year'],
            ['', '# preprints', '', '# preprints'],
            ['Team1', '10', '', '5'],
          ],
        },
      };

      mockSheetsClient.spreadsheets.values.get = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const result = await parsePreprintSheet(
        mockSheetsClient,
        mockSpreadsheetId,
        mockRange,
      );

      expect(result).toEqual([
        {
          Team: 'Team1',
          'All Time - # preprints': 10,
          'Last Year - # preprints': 5,
        },
      ]);
    });

    it('should return empty array when no rows are returned', async () => {
      const mockResponse = {
        data: {
          values: undefined,
        },
      };

      mockSheetsClient.spreadsheets.values.get = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const result = await parsePreprintSheet(
        mockSheetsClient,
        mockSpreadsheetId,
        mockRange,
      );

      expect(result).toEqual([]);
    });

    it('should return empty array when empty rows are returned', async () => {
      const mockResponse = {
        data: {
          values: [],
        },
      };

      mockSheetsClient.spreadsheets.values.get = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const result = await parsePreprintSheet(
        mockSheetsClient,
        mockSpreadsheetId,
        mockRange,
      );

      expect(result).toEqual([]);
    });

    it('should throw error when API call fails', async () => {
      const error = new Error('API Error');
      mockSheetsClient.spreadsheets.values.get = jest
        .fn()
        .mockRejectedValue(error);

      await expect(
        parsePreprintSheet(mockSheetsClient, mockSpreadsheetId, mockRange),
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
