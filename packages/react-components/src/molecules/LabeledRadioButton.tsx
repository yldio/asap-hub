import { ComponentProps } from 'react';
import { RadioButton, Label, FieldTitle } from '../atoms';

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
    <FieldTitle {...radioButtonProps}>{title}</FieldTitle>
  </Label>
);

export default LabeledRadioButton;
