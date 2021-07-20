import { StaticRouter } from 'react-router-dom';
import { array, text } from '@storybook/addon-knobs';
import { SkillsModal } from '@asap-hub/react-components';

export default {
  title: 'Templates / User Profile / Skills Modal',
};

export const Normal = () => (
  <StaticRouter>
    <SkillsModal
      skillsDescription={text('Description', '')}
      skills={[]}
      skillSuggestions={array('Skills', [
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
