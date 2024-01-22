import { SharedOutputDropdownWrapper } from '@asap-hub/react-components';
import { createAuthUser } from '@asap-hub/fixtures';
import { UserTeam, WorkingGroupMembership } from '@asap-hub/model';

export default {
  title: 'Organisms / Shared Output Dropdown',
  component: SharedOutputDropdownWrapper,
};

const workingGroups: WorkingGroupMembership[] = [
  {
    name: 'A Working Group',
    id: '1',
    // eslint-disable-next-line @typescript-eslint/prefer-as-const
    role: 'Chair' as 'Chair',
    active: true,
  },
];
const teams: UserTeam[] = [
  {
    displayName: 'A Team',
    id: '1',
    role: 'Lead PI (Core Leadership)',
  },
];
const user = {
  ...createAuthUser(),
  workingGroups,
  teams,
};

export const Normal = () => <SharedOutputDropdownWrapper user={user} />;
