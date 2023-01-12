import { ComponentProps } from 'react';

import SigninForm from './SigninForm';
import { AgreeToTerms } from '../molecules';
import { vminLinearCalc, mobileScreen, largeDesktopScreen } from '../pixels';
import { contentSidePaddingWithNavigation } from '../layout';

type SigninPageProps = ComponentProps<typeof SigninForm> &
  ComponentProps<typeof AgreeToTerms>;
const SigninPage: React.FC<SigninPageProps> = ({ appOrigin, ...props }) => (
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
      margin: 'auto',
    }}
  >
    <div css={{ width: 'max-content', maxWidth: '100%' }}>
      <SigninForm {...props} />
    </div>
    {props.signup && (
      <footer css={{ width: 0, minWidth: '100%' }}>
        <AgreeToTerms appOrigin={appOrigin} />
      </footer>
    )}
  </div>
);

export default SigninPage;
