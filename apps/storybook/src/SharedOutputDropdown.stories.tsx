import { SharedOutputDropdownBase } from '@asap-hub/react-components';
import { createAuthUser } from '@asap-hub/fixtures';
import { UserTeam, WorkingGroupMembership } from '@asap-hub/model';

export default {
  title: 'Organisms / Shared Output Dropdown',
  component: SharedOutputDropdownBase,
};

const workingGroups: WorkingGroupMembership[] = [
  {
    name: 'A Working Group',
    id: '1',
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
export const Normal = () => <SharedOutputDropdownBase user={user} />;
