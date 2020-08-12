import css from '@emotion/css';
import React, { ComponentProps } from 'react';

import asapBackground from '../images/asapbg.png';
import { Welcome } from '../templates';
import { Header } from '../molecules';
import { Link, Paragraph } from '../atoms';
import { perRem, tabletScreen } from '../pixels';

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
        <Link href="/">website</Link> for updates.
      </Paragraph>
    ),
  },
};

const backgroundStyles = css({
  alignItems: 'center',
  backgroundImage: `url(${asapBackground})`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  left: 0,
  position: 'absolute',
  right: 0,
  top: 0,
});

const linksContainerStyle = css({
  display: 'flex',
  listStyleType: 'none',
  padding: 0,
  margin: `0 -12px 0`,
});

const linkItemStyle = css({
  padding: `12px`,
});
const mobileVisibleStyles = css({
  [`@media (min-width: ${tabletScreen.width}px)`]: {
    display: 'none',
  },
});

const mobileHiddenStyles = css({
  display: 'none',
  [`@media (min-width: ${tabletScreen.width}px)`]: {
    display: 'block',
  },
});

type BackgroundProps = {
  readonly children: React.ReactNode;
};
const Background: React.FC<BackgroundProps> = ({ children }) => {
  return <div css={backgroundStyles}>{children}</div>;
};

type WelcomePageProps = Pick<ComponentProps<typeof Welcome>, 'onClick'> & {
  readonly signup?: boolean;
};
const WelcomePage: React.FC<WelcomePageProps> = ({
  signup = false,
  ...props
}) => {
  const copy = signup ? values.signup : values.welcome;
  const linksComponent = (
    <ul css={linksContainerStyle}>
      <li css={linkItemStyle}>
        <Link href="/terms-and-conditions">Terms and conditions</Link>
      </li>
      <li css={linkItemStyle}>
        <Link href="/privacy-policy">Privacy policy</Link>
      </li>
    </ul>
  );

  return (
    <Background>
      <div css={{ position: 'absolute', top: 0, width: '100%' }}>
        <Header transparent>
          <div css={mobileHiddenStyles}>{linksComponent}</div>
        </Header>
      </div>
      <div
        css={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          margin: `${12 / perRem}em`,
        }}
      >
        <Welcome
          title={copy.title}
          content={copy.content}
          buttonText={copy.buttonText}
          {...props}
        >
          {copy.footer && copy.footer()}
        </Welcome>
      </div>
      <div css={mobileVisibleStyles}>{linksComponent}</div>
    </Background>
  );
};

export default WelcomePage;
