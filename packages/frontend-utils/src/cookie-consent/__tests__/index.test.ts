import { waitFor } from '@testing-library/dom';
import { act, renderHook } from '@testing-library/react-hooks';
import Cookies from 'js-cookie';
import { v4 as uuidv4, validate } from 'uuid';
import {
  getConsentCookie,
  hasGivenCookieConsent,
  setConsentCookie,
  useCookieConsent,
} from '../index';

const originalFetch = global.fetch;

const COOKIE_NAME = 'consentPreferences';
const apiUrl = 'http://api.example.com';
jest.mock('js-cookie');

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mocked-uuid'),
  validate: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
  Cookies.get = jest.fn();
  Cookies.set = jest.fn();
});

afterEach(() => {
  global.fetch = originalFetch;
});

describe('setConsentCookie', () => {
  it('sets the consent cookie with the given preferences', () => {
    const preferences = { essential: true, analytics: false };
    setConsentCookie(COOKIE_NAME, { cookieId: 'id', preferences });
    expect(Cookies.set).toHaveBeenCalledWith(
      COOKIE_NAME,
      JSON.stringify({ cookieId: 'id', preferences }),
      { expires: 365 },
    );
  });
});

describe('getConsentCookie', () => {
  it('returns the consent preferences from the cookie', () => {
    const preferences = { essential: true, analytics: false };

    Cookies.get = jest.fn().mockReturnValueOnce(JSON.stringify(preferences));
    expect(getConsentCookie(COOKIE_NAME)).toEqual(preferences);
  });

  it('returns null if the cookie is not set', () => {
    Cookies.get = jest.fn().mockReturnValueOnce(undefined);

    expect(getConsentCookie(COOKIE_NAME)).toBeNull();
  });
});

describe('hasGivenCookieConsent', () => {
  it('returns true if the consent preferences are set and valid', () => {
    const preferences = { essential: true, analytics: false };
    Cookies.get = jest
      .fn()
      .mockReturnValueOnce(JSON.stringify({ cookieId: 'id', preferences }));
    expect(hasGivenCookieConsent(COOKIE_NAME)).toBe(true);
  });

  it('returns false if the consent preferences are not set', () => {
    Cookies.get = jest.fn().mockReturnValueOnce(undefined);
    expect(hasGivenCookieConsent(COOKIE_NAME)).toBe(false);
  });

  it('returns false if the cookie id is not set', () => {
    Cookies.get = jest
      .fn()
      .mockReturnValueOnce(
        JSON.stringify({ preferences: { essential: true, analytics: false } }),
      );
    expect(hasGivenCookieConsent(COOKIE_NAME)).toBe(false);
  });

  it('returns false if the consent preferences are invalid', () => {
    Cookies.get = jest
      .fn()
      .mockReturnValueOnce(JSON.stringify({ essential: true }));
    expect(hasGivenCookieConsent(COOKIE_NAME)).toBe(false);
  });
});

describe('useCookieConsent', () => {
  it('initially shows the cookie modal if consent has not been given', () => {
    Cookies.get = jest.fn().mockReturnValueOnce(undefined);
    const { result } = renderHook(() =>
      useCookieConsent({
        name: COOKIE_NAME,
        baseUrl: apiUrl,
        savePath: `save`,
      }),
    );
    expect(result.current.showCookieModal).toBe(true);
  });

  it('initially hides the cookie modal if consent has been given', () => {
    const preferences = { essential: true, analytics: false };
    Cookies.get = jest
      .fn()
      .mockReturnValueOnce(JSON.stringify({ cookieId: 'id', preferences }));
    const { result } = renderHook(() =>
      useCookieConsent({
        name: COOKIE_NAME,
        baseUrl: apiUrl,
        savePath: `save`,
      }),
    );
    expect(result.current.showCookieModal).toBe(false);
  });

  it('saves the cookie preferences and hides the modal when onSaveCookiePreferences is called', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(),
      } as Response),
    );
    const { result } = renderHook(() =>
      useCookieConsent({
        name: COOKIE_NAME,
        baseUrl: apiUrl,
        savePath: `save`,
      }),
    );

    await act(async () => result.current.onSaveCookiePreferences(true));

    const expectedCookieData = JSON.stringify({
      cookieId: 'mocked-uuid',
      preferences: { essential: true, analytics: true },
    });

    expect(Cookies.set).toHaveBeenCalledWith(COOKIE_NAME, expectedCookieData, {
      expires: 365,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      `${apiUrl}/save`,
      expect.objectContaining({ body: expectedCookieData }),
    );

    expect(result.current.showCookieModal).toBe(false);
  });

  it('should toggle the value of showCookieModal when toggleCookieModal is called', async () => {
    const { result } = renderHook(() =>
      useCookieConsent({
        name: COOKIE_NAME,
        baseUrl: apiUrl,
        savePath: `save`,
      }),
    );
    expect(result.current.showCookieModal).toBe(true);
    await act(async () => result.current.toggleCookieModal());
    expect(result.current.showCookieModal).toBe(false);
    await act(async () => result.current.toggleCookieModal());
    expect(result.current.showCookieModal).toBe(true);
  });

  const mockCookieName = 'test-cookie';

  it('should not call fetch if no cookieId exists', async () => {
    (Cookies.get as jest.Mock).mockReturnValue(null);

    renderHook(() =>
      useCookieConsent({
        name: mockCookieName,
        baseUrl: apiUrl,
        savePath: 'save',
      }),
    );

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should hide modal when remote data is consistent', async () => {
    const mockCookieData = {
      cookieId: 'test-id',
      preferences: {
        essential: true,
        analytics: true,
      },
    };

    (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify(mockCookieData));

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          cookieId: 'test-id',
          preferences: {
            essential: true,
            analytics: true,
          },
        }),
    });

    const { result } = renderHook(() =>
      useCookieConsent({
        name: mockCookieName,
        baseUrl: apiUrl,
        savePath: 'save',
      }),
    );

    expect(result.current.showCookieModal).toBe(false);
    expect(global.fetch).toHaveBeenCalledWith(
      `${apiUrl}/test-id`,
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('should show modal when remote data is inconsistent', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    const mockCookieData = {
      cookieId: 'test-id',
      preferences: {
        essential: true,
        analytics: true,
      },
    };

    (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify(mockCookieData));

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          cookieId: 'different-id',
          preferences: {
            essential: true,
            analytics: false,
          },
        }),
    });

    const { result } = renderHook(() =>
      useCookieConsent({
        name: mockCookieName,
        baseUrl: apiUrl,
        savePath: 'save',
      }),
    );

    await waitFor(() => {
      expect(result.current.showCookieModal).toBe(true);
    });
  });

  it('should show modal when cookie data is not found', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    const mockCookieData = {
      cookieId: 'test-id',
      preferences: {
        essential: true,
        analytics: true,
      },
    };

    (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify(mockCookieData));

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          error: 'Not found - mocked',
          statusCode: 404,
        }),
    });

    const { result } = renderHook(() =>
      useCookieConsent({
        name: mockCookieName,
        baseUrl: apiUrl,
        savePath: 'save',
      }),
    );

    await waitFor(() => {
      expect(result.current.showCookieModal).toBe(true);
    });
  });

  it('generates a new cookieId when no valid cookieId exists', async () => {
    (Cookies.get as jest.Mock).mockReturnValueOnce(
      JSON.stringify({
        cookieId: 'mocked-uuid',
        preferences: { essential: true, analytics: false },
      }),
    );

    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(),
      } as Response),
    );

    const { result } = renderHook(() =>
      useCookieConsent({
        name: COOKIE_NAME,
        baseUrl: apiUrl,
        savePath: 'save',
      }),
    );

    await act(async () => result.current.onSaveCookiePreferences(true));

    await waitFor(() => {
      expect(uuidv4).toHaveBeenCalled();
    });
  });

  it('does not generates a new cookieId when cookieId is Valid', async () => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(),
      } as Response),
    );

    jest.spyOn(Cookies, 'get').mockReturnValue(
      // @ts-expect-error Ignores jest mock expecting an object instead
      JSON.stringify({
        cookieId: 'ee8bb207-12a5-4567-9c78-1207ee174497',
        preferences: { essential: true, analytics: false },
      }),
    );

    (validate as jest.Mock).mockReturnValue(true);

    const { result } = renderHook(() =>
      useCookieConsent({
        name: COOKIE_NAME,
        baseUrl: apiUrl,
        savePath: 'save',
      }),
    );

    await act(async () => result.current.onSaveCookiePreferences(true));

    await waitFor(() => {
      expect(uuidv4).not.toHaveBeenCalled();
    });
  });
});
