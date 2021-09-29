export const { researchOutputToCSV } = jest.requireActual('../export');

export const createCsvFileStream = jest.fn(() => ({
  write: jest.fn(),
  end: jest.fn(),
}));
