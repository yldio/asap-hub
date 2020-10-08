export const mockLocation = (
  initialUrl = 'http://localhost/page?search#hash',
) => {
  const originalLocation = globalThis.location;
  const mockGetLocation: jest.MockedFunction<() => URL> = jest.fn();
  const mockSetLocation: jest.MockedFunction<(
    newLocation: string,
  ) => void> = jest.fn();
  const mockAssign: jest.MockedFunction<typeof globalThis.location.assign> = jest.fn();

  beforeEach(() => {
    mockGetLocation.mockReset().mockReturnValue(new URL(initialUrl));
    mockSetLocation.mockClear();
    mockAssign.mockClear();

    delete globalThis.location;
    class MockUrl extends URL {
      assign = mockAssign;
    }
    Object.defineProperty(globalThis, 'location', {
      configurable: true,
      enumerable: true,
      get: () => new MockUrl(mockGetLocation().href),
      set: mockSetLocation,
    });
  });
  afterEach(() => {
    Object.defineProperty(globalThis, 'location', {
      configurable: true,
      enumerable: true,
      value: originalLocation,
    });
  });

  return { mockGetLocation, mockSetLocation, mockAssign };
};
