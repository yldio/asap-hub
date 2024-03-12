import { LabeledCheckbox } from '@asap-hub/react-components';

import { text, boolean } from './knobs';

export default {
  title: 'Molecules / Labeled Checkbox',
  component: LabeledCheckbox,
};

export const Normal = () => (
  <LabeledCheckbox
    groupName="test1"
    checked={boolean('Checked', false)}
    enabled={boolean('Enabled', true)}
    title={text('Title', 'Option')}
  />
);
