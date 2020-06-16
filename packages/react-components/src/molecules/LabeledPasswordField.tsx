import React, { ComponentProps, useState } from 'react';
import css from '@emotion/css';

import { Label, TextField, Paragraph, Link, Button } from '../atoms';
import { perRem } from '../pixels';
import { showPasswordIcon, hidePasswordIcon } from '../icons';
import { fern } from '../colors';

const forgotPasswordStyles = css({
  paddingTop: `${6 / perRem}em`,
});

type LabeledPasswordFieldProps = {
  title?: string;

  forgotPasswordHref: string;
} & Pick<
  ComponentProps<typeof TextField>,
  'value' | 'onChange' | 'placeholder' | 'customValidationMessage'
>;
const LabeledPasswordField: React.FC<LabeledPasswordFieldProps> = ({
  title = 'Password',

  forgotPasswordHref,

  value,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Label>
      <Paragraph>
        <strong>{title}</strong>
      </Paragraph>
      <TextField
        {...props}
        value={value}
        type={showPassword ? 'text' : 'password'}
        customIndicator={
          value ? (
            <div
              css={{
                display: 'grid', // force the button to fill
                fill: fern.rgb,
              }}
            >
              <Button linkStyle onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? hidePasswordIcon : showPasswordIcon}
              </Button>
            </div>
          ) : undefined
        }
      />
      <div css={forgotPasswordStyles}>
        <Link href={forgotPasswordHref}>Forgot Password?</Link>
      </div>
    </Label>
  );
};

export default LabeledPasswordField;
