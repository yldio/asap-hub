import { isEnabled } from '@asap-hub/flags';
import { css, Global } from '@emotion/react';
import { ComponentProps } from 'react';
import { neutral200 } from '../colors';

import { Anchor, Link, Paragraph } from '../atoms';
import { cookieIcon } from '../icons';
import { backgroundNeuronsImage } from '../images';
import { mailToSupport } from '../mail';
import { CookiesModal, Toast, WelcomeCard } from '../organisms';
import { perRem } from '../pixels';
import { themes } from '../theme';
import { noop } from '../utils';

const defaultValues = {
  signup: {
    title: 'Join the ASAP Hub',
    content: 'Activate your account and start exploring the ASAP CRN Network.',
    buttonText: 'Activate account',
    footer: () => (
      <Paragraph accent="lead">
        By proceeding you are agreeing to our{' '}
        <Link href="/terms-and-conditions">Terms and Conditions</Link> and{' '}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </Paragraph>
    ),
  },
  welcome: {
    title: 'Welcome to the ASAP Hub',
    content:
      'A private, invite-only network where the ASAP CRN community collaborates.',
    buttonText: 'Sign in',
    footer: () => (
      <Paragraph accent="lead">
        By signing in you are agreeing to our{' '}
        <Link href="/terms-and-conditions">Terms and Conditions</Link> and{' '}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </Paragraph>
    ),
  },
};

const rootStyles = {
  'html, body, #root': {
    height: '100%',
  },
} as const;

const containerStyles = css({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',

  backgroundImage: `url(${backgroundNeuronsImage})`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
});
const bodyStyles = css({
  flexGrow: 1,

  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignContent: 'center',
  alignItems: 'center',
});

const welcomeStyles = css({
  flexBasis: '100%',
  order: 2,

  margin: `${12 / perRem}em`,
  display: 'flex',
  justifyContent: 'center',
});

const placeholderStyles = css({
  order: 4,
});

const iconStyles = css({
  display: 'flex',
  position: 'absolute',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '0.5em',
  backgroundColor: neutral200.rgb,
  borderRadius: '4px',
  bottom: '1em',
  left: '1em',
  cursor: 'pointer',
});

type WelcomeCopy = {
  title: string;
  content: string;
  buttonText: string;
  footer?: () => JSX.Element;
};

type WelcomePageProps = Pick<ComponentProps<typeof WelcomeCard>, 'onClick'> & {
  readonly allowSignup?: boolean;
  readonly authFailed?: 'alumni' | 'invalid';
  readonly onCloseAuthFailedToast?: () => void;
  readonly values?: { signup: WelcomeCopy; welcome: WelcomeCopy };
  readonly showCookieModal?: boolean;
  readonly toggleCookieModal?: () => void;
  readonly cookieData?: {
    cookieId?: string;
    preferences: { essential?: boolean; analytics?: boolean };
  } | null;
} & ComponentProps<typeof CookiesModal>;

const WelcomePage: React.FC<WelcomePageProps> = ({
  allowSignup = false,
  authFailed,
  onCloseAuthFailedToast = noop,
  values = defaultValues,
  showCookieModal = false,
  cookieData,
  onSaveCookiePreferences,
  toggleCookieModal,
  ...props
}) => {
  const copy = allowSignup ? values.signup : values.welcome;

  return (
    <>
      {isEnabled('DISPLAY_COOKIES') && showCookieModal && (
        <CookiesModal
          cookieData={cookieData}
          onSaveCookiePreferences={onSaveCookiePreferences}
        />
      )}
      <div css={[themes.dark, containerStyles]}>
        <Global styles={rootStyles} />
        {authFailed && (
          <Toast onClose={onCloseAuthFailedToast}>
            {authFailed === 'alumni'
              ? 'As an Alumni user, you no longer have access to this account. Please contact '
              : 'There was a problem with your account. If this issue persists, please contact '}
            <Anchor href={mailToSupport()}>
              <span css={{ textDecoration: 'underline' }}>ASAP Support</span>
            </Anchor>
            {authFailed === 'alumni' ? ' for further assistance.' : '.'}
          </Toast>
        )}
        <div css={bodyStyles}>
          <main css={welcomeStyles}>
            <WelcomeCard
              title={copy.title}
              content={copy.content}
              buttonText={copy.buttonText}
              {...props}
            >
              {copy.footer && copy.footer()}
            </WelcomeCard>
          </main>
          <div css={placeholderStyles} />
        </div>
        {isEnabled('DISPLAY_COOKIES') && !showCookieModal && (
          <span
            css={iconStyles}
            onClick={toggleCookieModal}
            data-testId="cookie-button"
          >
            {cookieIcon}
          </span>
        )}
      </div>
    </>
  );
};

export default WelcomePage;
