import React from 'react';
import { text, array } from '@storybook/addon-knobs';

import { LabeledTextArea } from '@asap-hub/react-components';

export default {
  title: 'Molecules / Labeled Text Area',
  component: LabeledTextArea,
};

export const Normal = () => (
  <LabeledTextArea
    title={text('Title', 'Members')}
    value={array('Value', ['John Doe', 'Bat Man'], '\n').join('\n')}
  />
);
export const Empty = () => (
  <LabeledTextArea
    title="Members"
    value=""
    placeholder={array(
      'Placeholder',
      ['Member 1', 'Member 2', '...'],
      '\n',
    ).join('\n')}
  />
);
export const Invalid = () => (
  <LabeledTextArea
    title="Members"
    value="John Doe\nBat Man"
    customValidationMessage={text(
      'Validation Error Message',
      'Must have at least 3 members.',
    )}
  />
);
