import { createLabs, createTeamResponse } from '@asap-hub/fixtures';
import { RoleModal } from '@asap-hub/react-components';
import { number } from '@storybook/addon-knobs';
import { StaticRouter } from 'react-router-dom';

export default {
  title: 'Templates / User Profile / Role Modal',
  component: RoleModal,
};

export const Normal = () => (
  <StaticRouter>
    <RoleModal
      backHref="#"
      labs={createLabs({ labs: number('Labs', 2, { min: 0 }) })}
      teams={Array.from({ length: number('Teams', 5) }, (__, i) => ({
        ...createTeamResponse({}, i),
        role: 'Collaborating PI',
      }))}
    />
  </StaticRouter>
);
