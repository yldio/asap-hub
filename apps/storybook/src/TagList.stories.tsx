import React from 'react';
import { TagList } from '@asap-hub/react-components';
import { array, number } from '@storybook/addon-knobs';

export default {
  title: 'Molecules / Tag List',
};

export const Normal = () => (
  <TagList
    min={number('Minimum number of tags shown on mobile', 3)}
    max={number('Maximum number of tags shown on desktop', 5)}
    tags={array('Skills', [
      'Neurological Diseases',
      'Clinical Neurology',
      'Adult Neurology',
      'Neuroimaging',
      'Neurologic Examination',
      'Neuroprotection',
      'Movement Disorders',
      'Neurodegenerative Diseases',
      'Neurological Diseases',
    ])}
  />
);
