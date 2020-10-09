/* eslint-disable no-console */
export const mockConsoleError = () => {
  const originalConsoleError = console.error;
  const mockConsoleError: jest.MockedFunction<typeof console.error> = jest.fn();

  beforeEach(() => {
    console.error = jest.fn();
    mockConsoleError.mockClear();
  });
  afterEach(() => {
    console.error = originalConsoleError;
  });

  return mockConsoleError;
};
