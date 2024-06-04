import { StaticRouter } from 'react-router-dom/server';
import { ExpertiseAndResourcesModal } from '@asap-hub/react-components';

import { array, text } from './knobs';

export default {
  title: 'Templates / User Profile / Expertise and Resources Modal',
};

export const Normal = () => (
  <StaticRouter>
    <ExpertiseAndResourcesModal
      expertiseAndResourceDescription={text('Description', '')}
      tags={[]}
      suggestions={array('Expertise and Resources', [
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
      backHref="#"
    />
  </StaticRouter>
);
