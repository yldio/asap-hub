import css from '@emotion/css';
import React, { ComponentProps } from 'react';

import WelcomeCard from './WelcomeCard';
import { Header } from '../molecules';
import { Anchor, Link, Paragraph } from '../atoms';
import { perRem, tabletScreen } from '../pixels';
import { backgroundNeuronsImage } from '../images';
import { themes } from '../theme';
import { Toast } from '../organisms';
import { noop } from '../utils';
import { mailToSupport } from '../mail';

const values = {
  signup: {
    title: 'Join the ASAP Hub',
    content: 'Confirm your account and start exploring the ASAP Network.',
    buttonText: 'Create account',
    footer: () => (
      <>
        <Paragraph accent="lead">
          Already have an account? <Link href="/">Sign in</Link>
        </Paragraph>
        <Paragraph accent="lead">
          By creating your account you are agreeing to the{' '}
          <Link href="/terms-and-conditions">Terms and Conditions</Link> of the
          ASAP Hub.
        </Paragraph>
      </>
    ),
  },
  welcome: {
    title: 'Welcome to the ASAP Hub',
    content: 'Where the ASAP Network collaborates!',
    buttonText: 'Sign in',
    footer: () => (
      <>
        <Paragraph accent="lead">
          This is a private network, only invited users can create an account.
          For more info, visit{' '}
          <Link href="https://parkinsonsroadmap.org/">ASAP</Link> website.
        </Paragraph>
        <Paragraph accent="lead">
          By signing in you are agreeing to the{' '}
          <Link href="/terms-and-conditions">Terms and Conditions</Link> of the
          ASAP Hub.
        </Paragraph>
      </>
    ),
  },
};

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
  alignContent: 'space-between',
  alignItems: 'center',
});

const headerStyles = css({
  flexGrow: 1,
  order: 0,
});

const welcomeStyles = css({
  flexBasis: '100%',
  order: 2,

  margin: `${12 / perRem}em`,
  display: 'flex',
  justifyContent: 'center',
});

const linksContainerStyles = css({
  flexGrow: 9999,
  order: 3,
  [`@media (min-width: ${tabletScreen.width}px)`]: {
    order: 1,
    justifyContent: 'flex-end',
  },

  display: 'flex',
  justifyContent: 'center',

  listStyleType: 'none',
  margin: 0,
  padding: `${12 / perRem}em`,
});
const linkItemStyles = css({
  padding: `${12 / perRem}em`,
});

const placeholderStyles = css({
  order: 4,
});

type WelcomePageProps = Pick<ComponentProps<typeof WelcomeCard>, 'onClick'> & {
  readonly allowSignup?: boolean;

  readonly authFailed?: boolean;
  readonly onCloseAuthFailedToast?: () => void;
};
const WelcomePage: React.FC<WelcomePageProps> = ({
  allowSignup = false,
  authFailed = false,
  onCloseAuthFailedToast = noop,
  ...props
}) => {
  const copy = allowSignup ? values.signup : values.welcome;

  return (
    <div css={[themes.dark, containerStyles]}>
      {authFailed && (
        <Toast onClose={onCloseAuthFailedToast}>
          There was a problem with your account. If this issue persists, please
          contact{' '}
          <Anchor href={mailToSupport()}>
            <span css={{ textDecoration: 'underline' }}>ASAP Support</span>
          </Anchor>
          .
        </Toast>
      )}
      <div css={bodyStyles}>
        <div css={headerStyles}>
          <Header transparent />
        </div>
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
        <ul css={linksContainerStyles}>
          <li css={linkItemStyles}>
            <Link href="/terms-and-conditions" theme="dark">
              Terms and conditions
            </Link>
          </li>
          <li css={linkItemStyles}>
            <Link href="/privacy-policy" theme="dark">
              Privacy policy
            </Link>
          </li>
        </ul>
        <div css={placeholderStyles} />
      </div>
    </div>
  );
};

export default WelcomePage;
