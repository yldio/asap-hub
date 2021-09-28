export const createCsvFileStream = () => ({
  write: jest.fn(),
  close: jest.fn(),
});
