import { ComponentProps, useState } from 'react';
import { css } from '@emotion/react';

import { Label, TextField, Paragraph, Link, Button } from '../atoms';
import { rem } from '../pixels';
import { showPasswordIcon, hidePasswordIcon } from '../icons';
import { fern } from '../colors';

const forgotPasswordStyles = css({
  paddingTop: rem(6),
});

const showPasswordIndicatorStyles = css({
  display: 'flex',
  height: '100%',
  // because our indicator is just text,
  // move it down from the center to align with the field text that is also below center
  paddingTop: rem(1),

  fill: fern.rgb,
});

type LabeledPasswordFieldProps = {
  readonly title?: React.ReactNode;

  readonly forgotPasswordHref?: string;
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
    <div>
      <Label
        forContent={(id) => (
          <TextField
            {...props}
            id={id}
            value={value}
            type={showPassword ? 'text' : 'password'}
            rightIndicator={
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
        <Paragraph noMargin styles={css({ paddingBottom: rem(16) })}>
          <strong>{title}</strong>
        </Paragraph>
      </Label>
      {forgotPasswordHref && (
        <div css={forgotPasswordStyles}>
          <Link href={forgotPasswordHref}>Forgot Password?</Link>
        </div>
      )}
    </div>
  );
};

export default LabeledPasswordField;
