import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import { LabeledPasswordField, LabeledTextField } from '../../molecules';
import { noop } from '../../utils';
import { perRem } from '../../pixels';
import { Button } from '../../atoms';

const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
});
const fieldsContainerStyles = css({
  paddingBottom: `${12 / perRem}em`,
});

type EmailPasswordSigninProps = Pick<
  ComponentProps<typeof LabeledPasswordField>,
  'forgotPasswordHref'
> & {
  email: string;
  onChangeEmail?: (newEmail: string) => void;

  password: string;
  onChangePassword?: (newPassword: string) => void;

  onSignin?: () => void;
};
const EmailPasswordSignin: React.FC<EmailPasswordSigninProps> = ({
  forgotPasswordHref,

  password,
  onChangePassword = noop,

  email,
  onChangeEmail = noop,

  onSignin = noop,
}) => (
  <div css={containerStyles}>
    <div css={fieldsContainerStyles}>
      <LabeledTextField title="Email" value={email} onChange={onChangeEmail} />
      <LabeledPasswordField
        forgotPasswordHref={forgotPasswordHref}
        value={password}
        onChange={onChangePassword}
      />
    </div>
    <Button primary onClick={onSignin}>
      Sign in
    </Button>
  </div>
);

export default EmailPasswordSignin;
