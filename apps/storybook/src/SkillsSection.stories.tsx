import React from 'react';
import { array } from '@storybook/addon-knobs';
import { SkillsSection } from '@asap-hub/react-components';

export default {
  title: 'Organisms / Skills',
};

export const Normal = () => (
  <SkillsSection
    skills={array('Skills', [
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
