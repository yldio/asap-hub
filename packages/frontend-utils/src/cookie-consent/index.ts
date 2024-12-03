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

  const [isSaving, setisSaving] = useState(false);

  const cookieData = getConsentCookie(name);

  const checkConsistencyWithRemote = async () => {
    if (!cookieData?.cookieId) return;
    const getUrl = `${baseUrl}/${cookieData.cookieId}`;

    const remoteCookieDataResponse = await fetch(getUrl, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    });

    const remoteCookieData = await remoteCookieDataResponse?.json();

    if (
      remoteCookieData?.error &&
      remoteCookieData?.statusCode === 404 &&
      !isSaving
    ) {
      setShowCookieModal(true);
    }

    if (!remoteCookieData || remoteCookieData?.error) return;

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
      setShowCookieModal(false);
      return;
    }

    setShowCookieModal(true);
  };

  const onSaveCookiePreferences = async (analytics: boolean) => {
    setisSaving(true);

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

    await fetch(saveUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(updatedCookieData),
    });

    setShowCookieModal(false);
    setisSaving(false);
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    checkConsistencyWithRemote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    showCookieModal,
    onSaveCookiePreferences,
    toggleCookieModal: () => setShowCookieModal((prev) => !prev),
    cookieData,
  };
};
