export const { researchOutputToCSV, MAX_ALGOLIA_RESULTS } =
  jest.requireActual('../export');

export const createCsvFileStream = jest.fn(() => ({
  write: jest.fn(),
  end: jest.fn(),
}));
