export const {
  researchOutputToCSV,
  algoliaResultsToStream,
  MAX_ALGOLIA_RESULTS,
} = jest.requireActual('../export');

export const createCsvFileStream = jest.fn(() => ({
  write: jest.fn(),
  end: jest.fn(),
}));
