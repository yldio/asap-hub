import React from 'react';
import css from '@emotion/css';

import { Display, Paragraph, Button } from '../atoms';
import { LabeledTextField } from '../molecules';
import { noop } from '../utils';
import { vminLinearCalc, mobileScreen, largeDesktopScreen } from '../pixels';
import { contentSidePaddingWithoutNavigation } from '../layout';

const styles = css({
  width: 'max-content',
  maxWidth: '100%',

  boxSizing: 'border-box',
  padding: `${vminLinearCalc(
    mobileScreen,
    36,
    largeDesktopScreen,
    72,
    'px',
  )} ${contentSidePaddingWithoutNavigation()}`,

  display: 'grid',
  gridTemplateColumns: '100%',
  gridRowGap: `${vminLinearCalc(
    mobileScreen,
    12,
    largeDesktopScreen,
    24,
    'px',
  )}`,

  textAlign: 'center',
});

const formStyles = css({
  maxWidth: '100%',
  display: 'grid',
  gridTemplateColumns: '100%',
});

interface ForgotPasswordPageProps {
  email: string;
  onChangeEmail?: (newEmail: string) => void;

  onSubmit?: () => void;
  onGoBack?: () => void;
}
const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  email,
  onChangeEmail = noop,
  onSubmit = noop,
  onGoBack = noop,
}) => (
  <div css={styles}>
    <div>
      <Display styleAsHeading={2}>Forgot Password</Display>
      <Paragraph primary accent="lead">
        We’ll send you a password reset link
      </Paragraph>
    </div>
    <form css={formStyles}>
      <LabeledTextField
        type="email"
        title="Email"
        value={email}
        onChange={onChangeEmail}
      />
      <Button primary onClick={onSubmit}>
        Send reset link
      </Button>
      <Button onClick={onGoBack}>Back</Button>
    </form>
  </div>
);

export default ForgotPasswordPage;
