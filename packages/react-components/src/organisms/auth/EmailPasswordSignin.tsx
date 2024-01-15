import { ComponentProps, useRef } from 'react';
import { css } from '@emotion/react';

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
  readonly signup?: boolean;

  readonly email: string;
  readonly onChangeEmail?: (newEmail: string) => void;

  readonly password: string;
  readonly onChangePassword?: (newPassword: string) => void;

  readonly emailValidationMessage?: string;
  readonly passwordValidationMessage?: string;
  readonly onSignin?: () => void;
};

const EmailPasswordSignin: React.FC<EmailPasswordSigninProps> = ({
  signup = false,
  forgotPasswordHref,

  password,
  onChangePassword = noop,

  email,
  onChangeEmail = noop,

  emailValidationMessage,
  passwordValidationMessage,
  onSignin = noop,
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form autoComplete="on" ref={formRef} css={containerStyles}>
      <div css={fieldsContainerStyles}>
        <LabeledTextField
          type="email"
          title="Email"
          value={email}
          onChange={onChangeEmail}
          customValidationMessage={emailValidationMessage}
        />
        <LabeledPasswordField
          required
          forgotPasswordHref={signup ? undefined : forgotPasswordHref}
          value={password}
          onChange={onChangePassword}
          customValidationMessage={passwordValidationMessage}
        />
      </div>
      <Button
        primary
        onClick={() => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          if (formRef.current!.reportValidity()) {
            onSignin();
          }
        }}
      >
        {signup ? 'Continue' : 'Sign in'}
      </Button>
    </form>
  );
};

export default EmailPasswordSignin;
