import { ComponentProps } from 'react';
import { CookiesModal, LogoProvider } from '@asap-hub/react-components';

export default {
  title: 'Organisms / Cookies Modal',
  component: CookiesModal,
};

const props: ComponentProps<typeof CookiesModal> = {
  showCookieModal: true,
  cookieData: { preferences: { essential: true, analytics: false } },
  onSaveCookiePreferences: () => Promise.resolve(),
};

export const Normal = () => (
  <LogoProvider appName="CRN">
    <CookiesModal {...props} />
  </LogoProvider>
);

export const Saving = () => (
  <LogoProvider appName="CRN">
    <CookiesModal
      {...props}
      // Resolves only after a long delay so the button stays in its saving state
      // for inspection: click "Save and close" to see the loading animation and
      // disabled styles.
      onSaveCookiePreferences={() =>
        new Promise<void>((resolve) => {
          setTimeout(resolve, 600000);
        })
      }
    />
  </LogoProvider>
);
