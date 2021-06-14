import { StaticRouter } from 'react-router-dom';
import { text } from '@storybook/addon-knobs';
import { SkillsModal } from '@asap-hub/react-components';

export default {
  title: 'Templates / User Profile / Skills Modal',
};

export const Normal = () => (
  <StaticRouter>
    <SkillsModal
      skillsDescription={text('Skills Description', '')}
      backHref="#"
    />
  </StaticRouter>
);
