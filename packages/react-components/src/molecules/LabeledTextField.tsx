import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import { Label, TextField, Paragraph } from '../atoms';
import { perRem } from '../pixels';
import { lead } from '../colors';

const subtitleStyles = css({
  color: lead.rgb,
});
const hintStyles = css({
  paddingTop: `${6 / perRem}em`,

  color: lead.rgb,
});

type LabeledTextFieldProps = {
  readonly title: React.ReactText | ReadonlyArray<React.ReactText>;
  readonly subtitle?: React.ReactText | ReadonlyArray<React.ReactText>;
  readonly hint?: React.ReactText | ReadonlyArray<React.ReactText>;
} & ComponentProps<typeof TextField>;
const LabeledTextField: React.FC<LabeledTextFieldProps> = ({
  title,
  subtitle,
  hint,
  ...textFieldProps
}) => (
  <Label>
    <Paragraph>
      <strong>{title}</strong>
      <br />
      <span css={subtitleStyles}>{subtitle}</span>
    </Paragraph>
    <TextField {...textFieldProps} />
    <div css={hintStyles}>{hint}</div>
  </Label>
);

export default LabeledTextField;
