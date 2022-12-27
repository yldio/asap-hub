import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { Label, Paragraph, TextField } from '../atoms';
import { lead } from '../colors';
import { perRem, tabletScreen } from '../pixels';

const containerStyles = css({
  paddingBottom: `${18 / perRem}em`,
});

const descriptionStyles = css({
  color: lead.rgb,
});
const forceDescriptionStyles = css({
  display: 'inline-block',
  [`@media (max-width: ${tabletScreen.width - 1}px)`]: {
    display: 'unset',
  },
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
  readonly showDescriptionSpace?: boolean;
} & Exclude<ComponentProps<typeof TextField>, 'id'>;

const subtitleStyles = css({
  paddingLeft: `${6 / perRem}em`,
});

const LabeledTextField: React.FC<LabeledTextFieldProps> = ({
  title,
  subtitle,
  description,
  hint,
  showDescriptionSpace = false,
  ...textFieldProps
}) => (
  <div css={containerStyles}>
    <Label forContent={(id) => <TextField {...textFieldProps} id={id} />}>
      <Paragraph>
        <strong>{title}</strong>
        <span css={subtitleStyles}>{subtitle}</span>
        <br />
        <span
          css={[
            descriptionStyles,
            showDescriptionSpace && forceDescriptionStyles,
          ]}
        >
          {description}
        </span>
      </Paragraph>
    </Label>
    <div css={hintStyles}>{hint}</div>
  </div>
);

export default LabeledTextField;
