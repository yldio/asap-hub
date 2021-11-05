import { StaticRouter } from 'react-router-dom';
import { array, text } from '@storybook/addon-knobs';
import { ExpertiseAndResourcesModal } from '@asap-hub/react-components';

export default {
  title: 'Templates / User Profile / Expertise and Resources Modal',
};

export const Normal = () => (
  <StaticRouter>
    <ExpertiseAndResourcesModal
      expertiseAndResourceDescription={text('Description', '')}
      expertiseAndResourceTags={[]}
      expertiseAndResourceSuggestions={array('Expertise and Resources', [
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
      backHref="#"
    />
  </StaticRouter>
);
