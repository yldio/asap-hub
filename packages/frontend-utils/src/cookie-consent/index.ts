import Cookies from 'js-cookie';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

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

export const useCookieConsent = (name: string, url: string) => {
  const [showCookieModal, setShowCookieModal] = useState(
    !hasGivenCookieConsent(name),
  );

  const cookieData = getConsentCookie(name);

  const onSaveCookiePreferences = async (analytics: boolean) => {
    const updatedCookieData = {
      cookieId: cookieData?.cookieId ?? uuidv4(),
      preferences: {
        essential: true,
        analytics,
      },
    };

    setConsentCookie(name, updatedCookieData);

    await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(updatedCookieData),
    });

    setShowCookieModal(false);
  };

  return {
    showCookieModal,
    onSaveCookiePreferences,
  };
};
