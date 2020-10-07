import css from '@emotion/css';
import React, { ComponentProps } from 'react';

import WelcomeCard from './WelcomeCard';
import { Header } from '../molecules';
import { Link, Paragraph } from '../atoms';
import { perRem, tabletScreen } from '../pixels';
import { backgroundBrainsImage } from '../images';
import { themes } from '../theme';

const values = {
  signup: {
    title: 'Join the ASAP Hub',
    content:
      'Create your account to start sharing, discussing and collaborating instantly.',
    buttonText: 'Create account',
    footer: () => (
      <Paragraph accent="lead">
        Already have an account? <Link href="/">Sign in</Link>
      </Paragraph>
    ),
  },
  welcome: {
    title: 'Welcome to the ASAP Hub',
    content:
      'The place for the ASAP community to share, discuss and collaborate.',
    buttonText: 'Sign in',
    footer: () => (
      <Paragraph accent="lead">
        Don't have an account? Keep an eye on ASAP's{' '}
        <Link href="https://parkinsonsroadmap.org/">website</Link> for updates.
      </Paragraph>
    ),
  },
};

const containerStyles = css({
  height: '100%',
  overflow: 'auto',

  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignContent: 'space-between',
  alignItems: 'center',

  backgroundImage: `url(${backgroundBrainsImage})`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
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
};
const WelcomePage: React.FC<WelcomePageProps> = ({
  allowSignup = false,
  ...props
}) => {
  const copy = allowSignup ? values.signup : values.welcome;

  return (
    <div css={[themes.dark, containerStyles]}>
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
  );
};

export default WelcomePage;
