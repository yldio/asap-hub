import { css } from '@emotion/react';
import { ComponentProps } from 'react';

import { Anchor, Link, Paragraph } from '../atoms';
import { perRem } from '../pixels';
import { backgroundNeuronsImage } from '../images';
import { themes } from '../theme';
import { Toast, WelcomeCard } from '../organisms';
import { noop } from '../utils';
import { mailToSupport } from '../mail';

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

type WelcomeCopy = {
  title: string;
  content: string;
  buttonText: string;
  footer?: () => JSX.Element;
};

type WelcomePageProps = Pick<ComponentProps<typeof WelcomeCard>, 'onClick'> & {
  readonly allowSignup?: boolean;

  readonly authFailed?: boolean;
  readonly onCloseAuthFailedToast?: () => void;
  readonly values?: { signup: WelcomeCopy; welcome: WelcomeCopy };
};
const WelcomePage: React.FC<WelcomePageProps> = ({
  allowSignup = false,
  authFailed = false,
  onCloseAuthFailedToast = noop,
  values,
  ...props
}) => {
  const copyValues = values || defaultValues;
  const copy = allowSignup ? copyValues.signup : copyValues.welcome;

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
    </div>
  );
};

export default WelcomePage;
