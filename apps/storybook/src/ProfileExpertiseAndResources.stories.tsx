import { ProfileExpertiseAndResources } from '@asap-hub/react-components';

import { array, text } from './knobs';
import { UserProfileDecorator } from './user-profile';

export default {
  title: 'Organisms / Profile / Expertise and Resources',
  decorators: [UserProfileDecorator],
};

export const Normal = () => (
  <ProfileExpertiseAndResources
    expertiseAndResourceDescription={text(
      'Description',
      "Multiple years of experience in research on Parkinson's Disease.",
    )}
    tags={array('Expertise and Resources', [
      'Neurological Diseases',
      'Clinical Neurology',
      'Adult Neurology',
      'Neuroimaging',
      'Neurologic Examination',
      'Neuroprotection',
      'Movement Disorders',
      'Neurodegenerative Diseases',
      'Neurological Diseases',
    ]).map((tag) => ({ name: tag, id: tag }))}
  />
);
