import React, { ComponentProps } from 'react';

import { Welcome } from '../templates';
import { Layout } from '../organisms';
import { Paragraph } from '..';

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

type WelcomePageProps = Pick<ComponentProps<typeof Welcome>, 'onClick'> & {
  readonly signup?: boolean;
};
const SigninPage: React.FC<WelcomePageProps> = ({
  signup = false,
  ...props
}) => {
  const copy = signup ? values.signup : values.welcome;
  return (
    <Layout>
      <div
        css={{
          width: 'max-content',
          maxWidth: '100%',
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
    </Layout>
  );
};

export default SigninPage;
