import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { Label, Paragraph, TextField } from '../atoms';
import { lead } from '../colors';
import { perRem } from '../pixels';

const containerStyles = css({
  paddingBottom: `${18 / perRem}em`,
});

const descriptionStyles = css({
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
  readonly description?: React.ReactNode;
  readonly hint?: React.ReactNode;
} & Exclude<ComponentProps<typeof TextField>, 'id'>;

const subtitleStyles = css({
  paddingLeft: `${6 / perRem}em`,
});

const LabeledTextField: React.FC<LabeledTextFieldProps> = ({
  title,
  subtitle,
  description,
  hint,
  ...textFieldProps
}) => (
  <div css={containerStyles}>
    <Label forContent={(id) => <TextField {...textFieldProps} id={id} />}>
      <Paragraph>
        <strong>{title}</strong>
        <span css={subtitleStyles}>{subtitle}</span>
        <br />
        <span css={descriptionStyles}>{description}</span>
      </Paragraph>
    </Label>
    <div css={hintStyles}>{hint}</div>
  </div>
);

export default LabeledTextField;
