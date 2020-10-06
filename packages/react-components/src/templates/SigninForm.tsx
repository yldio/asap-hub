import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import { EmailPasswordSignin, SsoButtons } from '../organisms';
import { Display, Paragraph, Divider } from '../atoms';
import { mobileScreen, largeDesktopScreen, vminLinearCalc } from '../pixels';

const styles = css({
  width: 'max-content',
  maxWidth: '100%',
  display: 'grid',
  gridTemplateColumns: '100%',
  gridGap: vminLinearCalc(mobileScreen, 12, largeDesktopScreen, 24, 'px'),
  justifyContent: 'center',
});
const headerStyles = css({
  textAlign: 'center',
});
const ignoreWidthStyles = css({
  width: 0,
  minWidth: '100%',
});

type SigninProps = {
  signup?: boolean;
} & ComponentProps<typeof SsoButtons> &
  ComponentProps<typeof EmailPasswordSignin>;
const Signin: React.FC<SigninProps> = ({
  signup = false,

  onGoogleSignin,
  onOrcidSignin,

  ...props
}) => (
  <article css={styles}>
    <header css={[headerStyles, ignoreWidthStyles]}>
      <Display styleAsHeading={2}>
        {signup ? 'Create your account' : 'Sign in to ASAP Hub'}
      </Display>
      <Paragraph primary accent="lead">
        Save time and sign in via Google or ORCID
      </Paragraph>
    </header>
    <SsoButtons onGoogleSignin={onGoogleSignin} onOrcidSignin={onOrcidSignin} />
    <div css={ignoreWidthStyles}>
      <Divider>or</Divider>
    </div>
    <EmailPasswordSignin signup={signup} {...props} />
  </article>
);

export default Signin;
