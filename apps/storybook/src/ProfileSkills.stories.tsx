import React from 'react';
import { array } from '@storybook/addon-knobs';
import { ProfileSkills } from '@asap-hub/react-components';

export default {
  title: 'Templates / Profile / Skills',
};

export const Normal = () => (
  <ProfileSkills
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

export const NoSkills = () => <ProfileSkills skills={array('Skills', [])} />;
