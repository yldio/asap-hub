/** @jest-environment jsdom */
import { mockLocation } from '@asap-hub/dom-test-utils';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('the detection script', () => {
  const detectionScriptCode = readFileSync(
    resolve(
      require.resolve('@asap-hub/crn-frontend/package.json'),
      '../build/detect-unsupported-browser.js',
    ),
  ).toString();

  afterEach(() => {
    globalThis.sessionStorage.clear();
  });

  const { mockAssign } = mockLocation();

  const originalWindowOpen = window.open;
  let mockWindowOpen: jest.MockedFunction<typeof globalThis.open>;
  beforeEach(() => {
    window.open = mockWindowOpen = jest.fn();
  });
  afterEach(() => {
    window.open = originalWindowOpen;
  });

  const mockNavigator = navigator as { userAgent: string };
  beforeEach(() => {
    expect(Object.getOwnPropertyDescriptor(mockNavigator, 'userAgent')).toBe(
      undefined,
    );
    Object.defineProperty(mockNavigator, 'userAgent', {
      configurable: true,
      writable: true,
      value: navigator.userAgent,
    });
  });
  afterEach(() => {
    delete mockNavigator.userAgent;
  });

  describe('on a modern browser', () => {
    beforeEach(() => {
      mockNavigator.userAgent =
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.152 Safari/537.36';
    });

    it('does not redirect', () => {
      eval(detectionScriptCode);
      expect(mockAssign).not.toHaveBeenCalled();
    });
  });

  describe('on an old browser', () => {
    beforeEach(() => {
      mockNavigator.userAgent =
        'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko';
    });

    it('redirects to the unsupported browser page', () => {
      eval(detectionScriptCode);
      expect(mockAssign).toHaveBeenCalledWith(
        expect.stringMatching(/unsupported.+browser/i),
      );
    });

    it('opens the unsupported browser page in a new tab the second time', () => {
      eval(detectionScriptCode);
      expect(mockWindowOpen).not.toHaveBeenCalled();
      eval(detectionScriptCode);
      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringMatching(/unsupported.+browser/i),
        expect.anything(),
      );
    });
  });
});
