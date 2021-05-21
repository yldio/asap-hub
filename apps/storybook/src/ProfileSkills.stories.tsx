import { array, text } from '@storybook/addon-knobs';
import { ProfileSkills } from '@asap-hub/react-components';
import { UserProfileDecorator } from './user-profile';

export default {
  title: 'Organisms / Profile / Skills',
  decorators: [UserProfileDecorator],
};

export const Normal = () => (
  <ProfileSkills
    skillsDescription={text(
      'Description',
      "Multiple years of experience in research on Parkinson's Disease.",
    )}
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
