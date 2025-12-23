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

/**
 * Mocks console.warn to suppress only React act() warnings while letting other warnings through.
 * Use this for tests that trigger unavoidable act() warnings from async validation state updates.
 *
 * @returns Jest spy with `mockRestore()` method to restore original console.warn
 */
export const mockActWarningsInConsole = () => {
  const originalConsoleWarn = console.warn;
  const spy = jest
    .spyOn(console, 'warn')
    .mockImplementation((...args: unknown[]) => {
      const message = args[0]?.toString() || '';
      if (
        message.includes('not wrapped in act(') ||
        message.includes('not configured to support act(')
      ) {
        return; // Suppress act() warnings
      }
      originalConsoleWarn.apply(console, args); // Let other warnings through
    });
  return spy;
};
