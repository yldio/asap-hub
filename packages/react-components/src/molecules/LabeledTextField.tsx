import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import { Label, TextField, Paragraph } from '../atoms';
import { perRem } from '../pixels';
import { lead } from '../colors';

const containerStyles = css({
  paddingBottom: `${18 / perRem}em`,
});

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
} & Exclude<ComponentProps<typeof TextField>, 'id'>;
const LabeledTextField: React.FC<LabeledTextFieldProps> = ({
  title,
  subtitle,
  hint,
  ...textFieldProps
}) => (
  <div css={containerStyles}>
    <Label forContent={(id) => <TextField {...textFieldProps} id={id} />}>
      <Paragraph>
        <strong>{title}</strong>
        <br />
        <span css={subtitleStyles}>{subtitle}</span>
      </Paragraph>
    </Label>
    <div css={hintStyles}>{hint}</div>
  </div>
);

export default LabeledTextField;
