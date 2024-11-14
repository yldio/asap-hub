import { renderHook, act } from '@testing-library/react-hooks';
import Cookies from 'js-cookie';
import {
  useCookieConsent,
  setConsentCookie,
  getConsentCookie,
  hasGivenCookieConsent,
} from '../index';

const COOKIE_NAME = 'consentPreferences';
const apiUrl = 'http://api.example.com';
jest.mock('js-cookie');

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mocked-uuid'),
}));

beforeEach(jest.clearAllMocks);

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
    const { result } = renderHook(() => useCookieConsent(COOKIE_NAME, apiUrl));
    expect(result.current.showCookieModal).toBe(true);
  });

  it('initially hides the cookie modal if consent has been given', () => {
    const preferences = { essential: true, analytics: false };
    Cookies.get = jest
      .fn()
      .mockReturnValueOnce(JSON.stringify({ cookieId: 'id', preferences }));
    const { result } = renderHook(() => useCookieConsent(COOKIE_NAME, apiUrl));
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
    const { result } = renderHook(() => useCookieConsent(COOKIE_NAME, apiUrl));

    await act(async () => result.current.onSaveCookiePreferences(true));

    const expectedCookieData = JSON.stringify({
      cookieId: 'mocked-uuid',
      preferences: { essential: true, analytics: true },
    });

    expect(Cookies.set).toHaveBeenCalledWith(COOKIE_NAME, expectedCookieData, {
      expires: 365,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      apiUrl,
      expect.objectContaining({ body: expectedCookieData }),
    );

    expect(result.current.showCookieModal).toBe(false);
  });
});
