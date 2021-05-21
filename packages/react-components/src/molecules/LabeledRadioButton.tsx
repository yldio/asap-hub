import { ComponentProps } from 'react';
import { RadioButton, Label } from '../atoms';

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
    {title}
  </Label>
);

export default LabeledRadioButton;
