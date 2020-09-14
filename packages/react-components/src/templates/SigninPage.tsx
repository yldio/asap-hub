import React, { ComponentProps } from 'react';

import SigninForm from './SigninForm';
import { AgreeToTerms } from '../molecules';
import { vminLinearCalc, mobileScreen, largeDesktopScreen } from '../pixels';
import { contentSidePaddingWithNavigation } from '../layout';

type SigninPageProps = ComponentProps<typeof SigninForm> &
  ComponentProps<typeof AgreeToTerms>;
const SigninPage: React.FC<SigninPageProps> = ({
  termsHref,
  privacyPolicyHref,
  ...props
}) => (
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
      <SigninForm {...props} />
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
);

export default SigninPage;
