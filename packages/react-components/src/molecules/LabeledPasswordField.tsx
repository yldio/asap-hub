import { ComponentProps, useState } from 'react';
import { css } from '@emotion/react';

import {
  Label,
  TextField,
  Paragraph,
  Link,
  Button,
  FieldTitle,
} from '../atoms';
import { perRem } from '../pixels';
import { showPasswordIcon, hidePasswordIcon } from '../icons';
import { fern } from '../colors';

const containerStyles = css({
  paddingBottom: `${18 / perRem}em`,
});

const forgotPasswordStyles = css({
  paddingTop: `${6 / perRem}em`,
});

const showPasswordIndicatorStyles = css({
  display: 'flex',
  height: '100%',
  // because our indicator is just text,
  // move it down from the center to align with the field text that is also below center
  paddingTop: `${1 / perRem}em`,

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
    <div css={containerStyles}>
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
          <FieldTitle {...props}>
            <strong>{title}</strong>
          </FieldTitle>
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
