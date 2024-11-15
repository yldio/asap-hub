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

export const useCookieConsent = (name: string) => {
  const [showCookieModal, setShowCookieModal] = useState(
    !hasGivenCookieConsent(name),
  );

  const cookieData = getConsentCookie(name);

  const onSaveCookiePreferences = (analytics: boolean) => {
    setConsentCookie(name, {
      cookieId: cookieData?.cookieId ?? uuidv4(),
      preferences: {
        essential: true,
        analytics,
      },
    });
    setShowCookieModal(false);
  };

  return {
    showCookieModal,
    onSaveCookiePreferences,
  };
};
