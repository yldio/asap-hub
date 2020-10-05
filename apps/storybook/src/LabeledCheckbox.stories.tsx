import React from 'react';
import { text, boolean } from '@storybook/addon-knobs';

import { LabeledCheckbox } from '@asap-hub/react-components';

export default {
  title: 'Molecules / Labeled Checkbox',
  component: LabeledCheckbox,
};

export const Normal = () => (
  <LabeledCheckbox
    groupName="test1"
    checked={boolean('Checked', false)}
    disabled={boolean('Disabled', false)}
    title={text('Title', 'Option')}
  />
);
