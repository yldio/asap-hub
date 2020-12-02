import React from 'react';
import { TagList } from '@asap-hub/react-components';
import { boolean, array } from '@storybook/addon-knobs';

export default {
  title: 'Molecules / Tag List',
};

export const Normal = () => {
  return (
    <TagList
      summarize={boolean('Summarize', false)}
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
      ]).map((label) => ({
        label,
        href: '#label',
      }))}
    />
  );
};
