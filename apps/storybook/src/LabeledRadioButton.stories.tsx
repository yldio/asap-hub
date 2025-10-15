import { LabeledRadioButton } from '@asap-hub/react-components';

import { text, boolean } from './knobs';

export default {
  title: 'Molecules / Labeled Radio Button',
  component: LabeledRadioButton,
};

export const Normal = () => (
  <LabeledRadioButton
    title={text('Title', 'Option Label')}
    tooltipText={text('Tooltip Text', '')}
    groupName="example"
    checked={boolean('Checked', false)}
    disabled={boolean('Disabled', false)}
  />
);

export const Checked = () => (
  <LabeledRadioButton title="Selected Option" groupName="example" checked />
);

export const Disabled = () => (
  <LabeledRadioButton title="Disabled Option" groupName="example" disabled />
);

export const DisabledChecked = () => (
  <LabeledRadioButton
    title="Disabled and Checked"
    groupName="example"
    checked
    disabled
  />
);

export const WithTooltip = () => (
  <LabeledRadioButton
    title="Option with Tooltip"
    tooltipText="Additional information about this option"
    groupName="example"
  />
);
