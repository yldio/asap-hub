import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import { EmailPasswordSignin, SsoButtons } from '../organisms';
import { Display, Divider, Paragraph } from '../atoms';
import {
  mobileScreen,
  largeDesktopScreen,
  vminLinearCalc,
  formTargetWidth,
  perRem,
} from '../pixels';

const styles = css({
  width: `${formTargetWidth / perRem}em`,
  maxWidth: '100%',
  display: 'grid',
  gridGap: vminLinearCalc(mobileScreen, 12, largeDesktopScreen, 24, 'px'),
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
        {signup ? 'Choose a login method' : 'Sign in to the ASAP Hub'}
      </Display>
      {signup ? (
        <Paragraph primary accent="lead">
          Please remember your choice, you'll need it to log in to the Hub in
          the future.
        </Paragraph>
      ) : null}
    </header>
    <SsoButtons onGoogleSignin={onGoogleSignin} onOrcidSignin={onOrcidSignin} />
    <div css={ignoreWidthStyles}>
      <Divider>or</Divider>
    </div>
    <EmailPasswordSignin signup={signup} {...props} />
  </article>
);

export default Signin;
