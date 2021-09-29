export const researchOutputToCSV = jest.fn();

export const createCsvFileStream = jest.fn(() => ({
  write: jest.fn(),
  end: jest.fn(),
}));

export const algoliaResultsToStream = jest.fn();
