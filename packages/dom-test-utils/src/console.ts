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
 * Mocks console.warn or console.error to suppress only React act() warnings while letting other messages through.
 * Use this for tests that trigger unavoidable act() warnings from async validation state updates.
 *
 * @param method - The console method to mock: 'warn' or 'error'. Defaults to 'warn'.
 * @returns Jest spy with `mockRestore()` method to restore original console method
 */
export const mockActWarningsInConsole = (method: 'error' | 'warn' = 'warn') => {
  const originalMethod = console[method];
  const spy = jest
    .spyOn(console, method)
    .mockImplementation((...args: unknown[]) => {
      const message = args[0]?.toString() || '';
      if (
        message.includes('not wrapped in act(') ||
        message.includes('not configured to support act(')
      ) {
        return; // Suppress act() warnings
      }
      originalMethod.apply(console, args); // Let other messages through
    });
  return spy;
};

/**
 * Mocks console.warn to suppress React Router 6 navigate() timing warnings.
 * Use this for tests with EditModal or components that trigger navigation on mount.
 *
 * @returns Jest spy with `mockRestore()` method to restore original console.warn
 */
export const mockNavigateWarningsInConsole = () => {
  const originalConsoleWarn = console.warn;
  const spy = jest
    .spyOn(console, 'warn')
    .mockImplementation((...args: unknown[]) => {
      const message = args[0]?.toString() || '';
      if (message.includes('call navigate() in a React.useEffect()')) {
        return; // Suppress React Router navigate warning
      }
      originalConsoleWarn.apply(console, args);
    });
  return spy;
};
