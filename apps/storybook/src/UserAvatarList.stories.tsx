import { number, text } from '@storybook/addon-knobs';
import { UserAvatarList } from '@asap-hub/react-components';
import { createTeamResponseMembers } from '@asap-hub/fixtures';

export default {
  title: 'Molecules / User Avatar List',
  component: UserAvatarList,
};

export const Normal = () => (
  <UserAvatarList
    members={createTeamResponseMembers({
      teamMembers: number('Number of members', 6),
    })}
    fullListRoute={text('Full List Route', 'someUrl')}
  />
);
