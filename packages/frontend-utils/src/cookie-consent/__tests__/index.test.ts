import { waitFor } from '@testing-library/dom';
import { act, renderHook } from '@testing-library/react';
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
const mockCookieName = 'test-cookie';
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

const storedCookie = {
  cookieId: 'test-id',
  preferences: { essential: true, analytics: true },
};

const renderConsentHook = (name: string = COOKIE_NAME) =>
  renderHook(() =>
    useCookieConsent({ name, baseUrl: apiUrl, savePath: 'save' }),
  );

const mockStoredCookie = (data: unknown = storedCookie) =>
  (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify(data));

const mockFetchResponseOnce = (response: Partial<Response>) =>
  jest
    .spyOn(global, 'fetch')
    .mockImplementationOnce(() => Promise.resolve(response as Response));

const mockRemoteConsistencyFetch = (body: unknown) =>
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(body),
  } as Response);

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
    const { result } = renderConsentHook();
    expect(result.current.showCookieModal).toBe(true);
  });

  it('initially hides the cookie modal if consent has been given', () => {
    const preferences = { essential: true, analytics: false };
    Cookies.get = jest
      .fn()
      .mockReturnValueOnce(JSON.stringify({ cookieId: 'id', preferences }));
    const { result } = renderConsentHook();
    expect(result.current.showCookieModal).toBe(false);
  });

  it('saves the cookie preferences and hides the modal when onSaveCookiePreferences is called', async () => {
    const fetchMock = mockFetchResponseOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(),
    });
    const { result } = renderConsentHook();

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

  it('keeps the modal open while the save request is in flight and closes it once resolved', async () => {
    let resolveFetch: (response: Response) => void = () => undefined;
    jest.spyOn(global, 'fetch').mockImplementationOnce(
      () =>
        new Promise<Response>((resolve) => {
          resolveFetch = resolve;
        }),
    );
    const { result } = renderConsentHook();

    let savePromise: Promise<void> = Promise.resolve();
    act(() => {
      savePromise = result.current.onSaveCookiePreferences(true);
    });

    expect(result.current.showCookieModal).toBe(true);

    await act(async () => {
      resolveFetch({
        ok: true,
        status: 200,
        json: () => Promise.resolve(),
      } as Response);
      await savePromise;
    });

    expect(result.current.showCookieModal).toBe(false);
  });

  it('closes the modal even when the save request fails', async () => {
    mockFetchResponseOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve(),
    });
    const { result } = renderConsentHook();

    await act(async () => {
      await result.current.onSaveCookiePreferences(true).catch(() => undefined);
    });

    expect(result.current.showCookieModal).toBe(false);
  });

  it('throws error when save response is null', async () => {
    mockFetchResponseOnce(null as unknown as Response);
    const { result } = renderConsentHook();

    await expect(
      act(async () => result.current.onSaveCookiePreferences(true)),
    ).rejects.toThrow('Failed to save cookie preferences: unknown');
  });

  it('throws error when save response is not ok with status code', async () => {
    mockFetchResponseOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve(),
    });
    const { result } = renderConsentHook();

    await expect(
      act(async () => result.current.onSaveCookiePreferences(true)),
    ).rejects.toThrow('Failed to save cookie preferences: 500');
  });

  it('throws error when save response is not ok without status code', async () => {
    mockFetchResponseOnce({
      ok: false,
      json: () => Promise.resolve(),
    });
    const { result } = renderConsentHook();

    await expect(
      act(async () => result.current.onSaveCookiePreferences(true)),
    ).rejects.toThrow('Failed to save cookie preferences: unknown');
  });

  it('should toggle the value of showCookieModal when toggleCookieModal is called', async () => {
    const { result } = renderConsentHook();
    expect(result.current.showCookieModal).toBe(true);
    await act(async () => result.current.toggleCookieModal());
    expect(result.current.showCookieModal).toBe(false);
    await act(async () => result.current.toggleCookieModal());
    expect(result.current.showCookieModal).toBe(true);
  });

  it('should not call fetch if no cookieId exists', async () => {
    (Cookies.get as jest.Mock).mockReturnValue(null);

    renderConsentHook(mockCookieName);

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should hide modal when remote data is consistent', async () => {
    mockStoredCookie();
    mockRemoteConsistencyFetch(storedCookie);

    const { result } = renderConsentHook(mockCookieName);

    expect(result.current.showCookieModal).toBe(false);
    expect(global.fetch).toHaveBeenCalledWith(
      `${apiUrl}/test-id`,
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('should show modal when remote data is inconsistent', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    mockStoredCookie();
    mockRemoteConsistencyFetch({
      cookieId: 'different-id',
      preferences: { essential: true, analytics: false },
    });

    const { result } = renderConsentHook(mockCookieName);

    await waitFor(() => {
      expect(result.current.showCookieModal).toBe(true);
    });
  });

  it('should show modal when remote cookie data returns 404 status', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    mockStoredCookie();

    const fetchPromise = Promise.resolve({
      ok: false,
      status: 404,
    } as Response);
    (global.fetch as jest.Mock).mockReturnValue(fetchPromise);

    const { result } = renderConsentHook(mockCookieName);

    await act(async () => {
      await fetchPromise;
    });

    await waitFor(() => {
      // Modal should show when remote data is not found (404)
      expect(result.current.showCookieModal).toBe(true);
    });
  });

  it('should not show modal when fetch fails with non-404 error', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    mockStoredCookie();

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    } as Response);

    const { result } = renderConsentHook(mockCookieName);

    await waitFor(() => {
      // Modal should not show when fetch fails for non-404 reasons
      expect(result.current.showCookieModal).toBe(false);
    });
  });

  it('should not show modal when fetch returns null/undefined response', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    mockStoredCookie();

    (global.fetch as jest.Mock).mockResolvedValue(null);

    const { result } = renderConsentHook(mockCookieName);

    await waitFor(() => {
      // Modal should not show when fetch returns null
      expect(result.current.showCookieModal).toBe(false);
    });
  });

  it('should not show modal when remoteCookieData is null', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    mockStoredCookie();
    mockRemoteConsistencyFetch(null);

    const { result } = renderConsentHook(mockCookieName);

    await waitFor(() => {
      // Modal should not show when remoteCookieData is null
      expect(result.current.showCookieModal).toBe(false);
    });
  });

  it('should not show modal when remoteCookieData has error', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    mockStoredCookie();
    mockRemoteConsistencyFetch({ error: 'Some error occurred' });

    const { result } = renderConsentHook(mockCookieName);

    await waitFor(() => {
      // Modal should not show when remoteCookieData has error
      expect(result.current.showCookieModal).toBe(false);
    });
  });

  it('should not show modal when remoteCookieData is missing preferences', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    mockStoredCookie();
    mockRemoteConsistencyFetch({ cookieId: 'test-id' });

    const { result } = renderConsentHook(mockCookieName);

    await waitFor(() => {
      // Modal should not show when remoteCookieData is missing preferences
      expect(result.current.showCookieModal).toBe(false);
    });
  });

  it('generates a new cookieId when no valid cookieId exists', async () => {
    (Cookies.get as jest.Mock).mockReturnValueOnce(
      JSON.stringify({
        cookieId: 'mocked-uuid',
        preferences: { essential: true, analytics: false },
      }),
    );

    mockFetchResponseOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(),
    });

    const { result } = renderConsentHook();

    await act(async () => result.current.onSaveCookiePreferences(true));

    await waitFor(() => {
      expect(uuidv4).toHaveBeenCalled();
    });
  });

  it('does not generates a new cookieId when cookieId is Valid', async () => {
    (Cookies.get as jest.Mock) = jest.fn().mockReturnValue(
      JSON.stringify({
        cookieId: 'ee8bb207-12a5-4567-9c78-1207ee174497',
        preferences: { essential: true, analytics: false },
      }),
    );

    (validate as jest.Mock).mockReturnValue(true);

    // Mock fetch to handle both the checkConsistencyWithRemote call and the onSaveCookiePreferences call
    (global.fetch as jest.Mock).mockImplementation((url) => {
      // First call is for checkConsistencyWithRemote (GET request)
      if (url.includes('ee8bb207-12a5-4567-9c78-1207ee174497')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              cookieId: 'ee8bb207-12a5-4567-9c78-1207ee174497',
              preferences: { essential: true, analytics: false },
            }),
        } as Response);
      }
      // Second call is for onSaveCookiePreferences (POST request)
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(),
      } as Response);
    });

    const { result } = renderConsentHook();

    await act(async () => result.current.onSaveCookiePreferences(true));

    await waitFor(() => {
      expect(uuidv4).not.toHaveBeenCalled();
    });
  });

  it('clears cookies with prefix "_ga" and clears window.dataLayer when analytics is false', async () => {
    jest.spyOn(console, 'warn').mockImplementation();
    (Cookies.get as jest.Mock).mockImplementation((name) => {
      if (name) {
        return JSON.stringify({
          cookieId: 'mocked-uuid',
          preferences: { essential: true, analytics: false },
        });
      }
      return {
        _ga123: 'value1',
        _ga456: 'value2',
        unrelatedCookie: 'value3',
      };
    });

    // Mock fetch for checkConsistencyWithRemote call and onSaveCookiePreferences call
    (global.fetch as jest.Mock).mockImplementation((_url, options) => {
      // GET request is for checkConsistencyWithRemote
      if (options?.method === 'GET' || !options?.method) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              cookieId: 'mocked-uuid',
              preferences: { essential: true, analytics: false },
            }),
        } as Response);
      }
      // POST request is for onSaveCookiePreferences
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(),
      } as Response);
    });

    const mockRemove = jest.spyOn(Cookies, 'remove');

    // Set up dataLayer before the test
    window.dataLayer = [{ test: 'data' }];

    const { result } = renderConsentHook();

    await act(async () => result.current.onSaveCookiePreferences(false));

    expect(mockRemove).toHaveBeenCalledWith('_ga123');
    expect(mockRemove).toHaveBeenCalledWith('_ga456');
    expect(mockRemove).not.toHaveBeenCalledWith('unrelatedCookie');
    expect(window.dataLayer).toBeUndefined();
  });
});
