import { ComponentProps } from 'react';
import { css } from '@emotion/react';
import { Label, Paragraph, RadioButton } from '../atoms';
import { steel } from '../colors';

const disabledStyles = css({
  color: steel.rgb,
});

type LabeledRadioButtonProps = {
  readonly title: string;
  readonly tooltipText?: string;
} & ComponentProps<typeof RadioButton>;
const LabeledRadioButton: React.FC<LabeledRadioButtonProps> = ({
  title,
  tooltipText,
  ...radioButtonProps
}) => {
  return (
    <Label
      trailing
      forContent={(id) => <RadioButton {...radioButtonProps} id={id} />}
      title={tooltipText}
    >
      <Paragraph
        noMargin
        styles={radioButtonProps.disabled ? disabledStyles : undefined}
      >
        {title}
      </Paragraph>
    </Label>
  );
};

export default LabeledRadioButton;
