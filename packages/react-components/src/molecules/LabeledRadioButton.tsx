import { ComponentProps } from 'react';
import { Label, Paragraph, RadioButton } from '../atoms';
import { css } from '@emotion/react';
import { steel } from '../colors';

const disabledStyles = css({
  color: steel.rgb,
});

type LabeledRadioButtonProps = {
  readonly title: string;
} & ComponentProps<typeof RadioButton>;
const LabeledRadioButton: React.FC<LabeledRadioButtonProps> = ({
  title,
  ...radioButtonProps
}) => (
  <Label
    trailing
    forContent={(id) => <RadioButton {...radioButtonProps} id={id} />}
  >
    <Paragraph
      noMargin
      styles={radioButtonProps.disabled ? disabledStyles : undefined}
    >
      {title}
    </Paragraph>
  </Label>
);

export default LabeledRadioButton;
