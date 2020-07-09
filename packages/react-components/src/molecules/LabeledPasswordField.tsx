import React, { ComponentProps, useState } from 'react';
import css from '@emotion/css';

import { Label, TextField, Paragraph, Link, Button } from '../atoms';
import { perRem } from '../pixels';
import { showPasswordIcon, hidePasswordIcon } from '../icons';
import { fern } from '../colors';

const forgotPasswordStyles = css({
  paddingTop: `${6 / perRem}em`,
});

const showPasswordIndicatorStyles = css({
  display: 'grid', // force the button to fill

  // because our indicator is just text,
  // move it down from the center to align with the field text that is also below center
  paddingTop: `${1 / perRem}em`,

  fill: fern.rgb,
});

type LabeledPasswordFieldProps = {
  readonly title?: string;

  readonly forgotPasswordHref: string;
} & Pick<
  ComponentProps<typeof TextField>,
  'value' | 'onChange' | 'required' | 'placeholder' | 'customValidationMessage'
>;
const LabeledPasswordField: React.FC<LabeledPasswordFieldProps> = ({
  title = 'Password',

  forgotPasswordHref,

  value,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Label
        forContent={(id) => (
          <TextField
            {...props}
            id={id}
            value={value}
            type={showPassword ? 'text' : 'password'}
            customIndicator={
              value ? (
                <div css={showPasswordIndicatorStyles}>
                  <Button
                    linkStyle
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? hidePasswordIcon : showPasswordIcon}
                  </Button>
                </div>
              ) : undefined
            }
          />
        )}
      >
        <Paragraph>
          <strong>{title}</strong>
        </Paragraph>
      </Label>
      <div css={forgotPasswordStyles}>
        <Link href={forgotPasswordHref}>Forgot Password?</Link>
      </div>
    </>
  );
};

export default LabeledPasswordField;
