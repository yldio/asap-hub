import { SharedOutputDropdownWrapper } from '@asap-hub/react-components';
import { createAuthUser } from '@asap-hub/fixtures';

export default {
  title: 'Organisms / Shared Output Dropdown',
  component: SharedOutputDropdownWrapper,
};

type AuthUser = ReturnType<typeof createAuthUser>;

const workingGroups: AuthUser['workingGroups'] = [
  {
    name: 'A Working Group',
    id: '1',
    roles: ['Chair'],
    active: true,
  },
];
const teams: AuthUser['teams'] = [
  {
    displayName: 'A Team',
    id: '1',
    roles: ['Lead PI (Core Leadership)'],
  },
];
const user = {
  ...createAuthUser(),
  workingGroups,
  teams,
};

export const Normal = () => <SharedOutputDropdownWrapper user={user} />;
