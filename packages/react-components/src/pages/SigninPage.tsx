import React, { ComponentProps } from 'react';

import { Signin } from '../templates';
import { AgreeToTerms } from '../molecules';
import { Layout } from '../organisms';
import {
  vminLinearCalc,
  mobileScreen,
  largeDesktopScreen,
  contentSidePaddingWithNavigation,
} from '../pixels';

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
        boxSizing: 'border-box',
        width: 'max-content',
        maxWidth: '100%',
        padding: `${vminLinearCalc(
          mobileScreen,
          36,
          largeDesktopScreen,
          72,
          'px',
        )} ${contentSidePaddingWithNavigation()}`,
      }}
    >
      <div css={{ width: 'max-content', maxWidth: '100%' }}>
        <Signin {...props} />
      </div>
      {props.signup && (
        <footer css={{ width: 0, minWidth: '100%' }}>
          <AgreeToTerms
            termsHref={termsHref}
            privacyPolicyHref={privacyPolicyHref}
          />
        </footer>
      )}
    </div>
  </Layout>
);

export default SigninPage;
