import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { v4 as uuidv4, validate as isValidUUID } from 'uuid';

type CookieData = {
  cookieId: string;
  preferences: {
    essential: boolean;
    analytics: boolean;
  };
};

const GA_COOKIES_PREFIX = '_ga';

export const setConsentCookie = (
  name: string,
  preferences: CookieData,
): void => {
  Cookies.set(name, JSON.stringify(preferences), {
    expires: 365,
  });
};

export const getConsentCookie = (name: string): CookieData | null => {
  const cookieValue = Cookies.get(name);
  return cookieValue ? JSON.parse(cookieValue) : null;
};

export const hasGivenCookieConsent = (name: string): boolean => {
  const cookie = getConsentCookie(name);

  return (
    cookie !== null &&
    typeof cookie.cookieId === 'string' &&
    typeof cookie.preferences.essential === 'boolean' &&
    typeof cookie.preferences.analytics === 'boolean'
  );
};

export const clearCookiesWithPrefix = (prefix: string): void => {
  const allCookies = Cookies.get();
  Object.keys(allCookies).forEach((cookieName) => {
    if (cookieName.startsWith(prefix)) {
      Cookies.remove(cookieName);
    }
  });
};

export const useCookieConsent = ({
  name,
  baseUrl,
  savePath,
}: {
  name: string;
  baseUrl: string;
  savePath: string;
}) => {
  const saveUrl = `${baseUrl}/${savePath}`;
  const [showCookieModal, setShowCookieModal] = useState(
    !hasGivenCookieConsent(name),
  );

  const cookieData = getConsentCookie(name);

  const checkConsistencyWithRemote = async () => {
    // Only check consistency if user has saved preferences locally
    if (!cookieData?.cookieId) return;
    const getUrl = `${baseUrl}/${cookieData.cookieId}`;

    const remoteCookieDataResponse = await fetch(getUrl, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    });

    // If cookie not found in backend (404): consider inconsistent, show modal
    if (remoteCookieDataResponse?.status === 404) {
      setShowCookieModal(true);
      return;
    }

    // If fetch fails for other reasons: do not show modal, do nothing
    if (!remoteCookieDataResponse || !remoteCookieDataResponse.ok) {
      return;
    }

    const remoteCookieData = await remoteCookieDataResponse.json();

    if (
      !remoteCookieData ||
      remoteCookieData?.error ||
      !remoteCookieData?.preferences
    )
      return;

    // Fetch successful: check if consistent with local
    const {
      cookieId: remoteCookieId,
      preferences: { analytics: remoteAnalytics },
    } = remoteCookieData;

    const {
      cookieId,
      preferences: { analytics },
    } = cookieData;

    const isConsistent =
      remoteCookieId === cookieId && remoteAnalytics === analytics;

    if (isConsistent) {
      // Consistent: don't show modal, do nothing
      setShowCookieModal(false);
      return;
    }

    // Not consistent: show modal (user will save again, triggering onSaveCookiePreferences flow)
    setShowCookieModal(true);
  };

  const onSaveCookiePreferences = async (analytics: boolean) => {
    // Step 1: Save preferences locally first
    if (!analytics) {
      clearCookiesWithPrefix(GA_COOKIES_PREFIX);
      // Clear dataLayer when analytics is disabled
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer = undefined;
      }
    }

    const updatedCookieData = {
      cookieId:
        cookieData?.cookieId && isValidUUID(cookieData.cookieId)
          ? cookieData?.cookieId
          : uuidv4(),
      preferences: {
        essential: true,
        analytics,
      },
    };

    setConsentCookie(name, updatedCookieData);
    setShowCookieModal(false);

    // Step 2: Attempt to save to backend (errors will be caught by Sentry)
    const response = await fetch(saveUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(updatedCookieData),
    });

    if (!response || !response.ok) {
      throw new Error(
        `Failed to save cookie preferences: ${response?.status || 'unknown'}`,
      );
    }
    // If saved successfully: do nothing (prefs already saved locally)
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    checkConsistencyWithRemote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    showCookieModal,
    onSaveCookiePreferences,
    toggleCookieModal: () => setShowCookieModal((prev: boolean) => !prev),
    cookieData,
  };
};
