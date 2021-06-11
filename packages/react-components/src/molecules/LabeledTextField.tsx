import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import { Label, TextField, Paragraph, RequiredAsterisk } from '../atoms';
import { perRem } from '../pixels';
import { lead } from '../colors';

const containerStyles = css({
  paddingBottom: `${18 / perRem}em`,
});

const subtitleStyles = css({
  color: lead.rgb,
});
const hintStyles = css({
  ':empty': {
    display: 'none',
  },
  paddingTop: `${6 / perRem}em`,

  color: lead.rgb,
});

type LabeledTextFieldProps = {
  readonly title: React.ReactNode;
  readonly subtitle?: React.ReactNode;
  readonly hint?: React.ReactNode;
} & Exclude<ComponentProps<typeof TextField>, 'id'> &
  ComponentProps<typeof RequiredAsterisk>;

const LabeledTextField: React.FC<LabeledTextFieldProps> = ({
  title,
  subtitle,
  hint,
  ...textFieldProps
}) => (
  <div css={containerStyles}>
    <Label forContent={(id) => <TextField {...textFieldProps} id={id} />}>
      <Paragraph>
        <strong>
          {title}
          <RequiredAsterisk {...textFieldProps} />
        </strong>

        <br />
        <span css={subtitleStyles}>{subtitle}</span>
      </Paragraph>
    </Label>
    <div css={hintStyles}>{hint}</div>
  </div>
);

export default LabeledTextField;
