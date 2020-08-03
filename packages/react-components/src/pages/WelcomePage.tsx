import React, { ComponentProps } from 'react';
import asapBackground from '../images/asapbg.png';

import { Welcome } from '../templates';
import { Paragraph } from '..';
import css from '@emotion/css';

const values = {
  signup: {
    title: 'Join the ASAP Hub',
    content:
      'Create your account to start sharing, discussing and collaborating instantly.',
    buttonText: 'Create account',
    footer: () => (
      <Paragraph accent="lead">Already have an ASAP Hub account?</Paragraph>
    ),
  },
  welcome: {
    title: 'Welcome to the ASAP Hub',
    content:
      'The place for the ASAP community to share, discuss and collaborate.',
    buttonText: 'Sign in',
    footer: () => (
      <Paragraph accent="lead">
        Don't have an account? Keep an eye on ASAP's website for updates.
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
  justifyContent: 'center',
  left: 0,
  position: 'absolute',
  right: 0,
  top: 0,
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
const SigninPage: React.FC<WelcomePageProps> = ({
  signup = false,
  ...props
}) => {
  const copy = signup ? values.signup : values.welcome;
  return (
    <Background>
      <Welcome
        title={copy.title}
        content={copy.content}
        buttonText={copy.buttonText}
        {...props}
      >
        {copy.footer && copy.footer()}
      </Welcome>
    </Background>
  );
};

export default SigninPage;
