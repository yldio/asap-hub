import { createLabs, createUserTeams } from '@asap-hub/fixtures';
import { RoleModal } from '@asap-hub/react-components';
import { number, select, text } from './knobs';
import { StaticRouter } from 'react-router-dom';

export default {
  title: 'Templates / User Profile / Role Modal',
  component: RoleModal,
};

export const Normal = () => (
  <StaticRouter>
    <RoleModal
      backHref="#"
      firstName={text('First name', 'John')}
      labs={createLabs({ labs: number('Labs', 1, { min: 0 }) })}
      teams={createUserTeams({ teams: number('Teams', 1, { min: 0 }) })}
      role={select('ASAP Hub Role', ['Staff', 'Grantee', 'Guest'], 'Grantee')}
    />
  </StaticRouter>
);
