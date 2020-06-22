import React, { ComponentProps } from 'react';

import { Signin } from '../templates';
import { AgreeToTerms } from '../molecules';
import { Layout } from '../organisms';

type SigninPageProps = ComponentProps<typeof Signin> &
  ComponentProps<typeof AgreeToTerms>;
const SigninPage: React.FC<SigninPageProps> = ({
  termsHref,
  privacyPolicyHref,
  ...props
}) => (
  <Layout>
    <div
      css={{
        width: 'max-content',
        maxWidth: '100%',
      }}
    >
      <div css={{ width: 'max-content', maxWidth: '100%' }}>
        <Signin {...props} />
      </div>
      <footer css={{ width: 0, minWidth: '100%' }}>
        <AgreeToTerms
          termsHref={termsHref}
          privacyPolicyHref={privacyPolicyHref}
        />
      </footer>
    </div>
  </Layout>
);

export default SigninPage;
