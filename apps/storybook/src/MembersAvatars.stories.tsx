import { number, text } from '@storybook/addon-knobs';
import { MembersAvatars } from '@asap-hub/react-components';
import { createTeamResponseMembers } from '@asap-hub/fixtures';

export default {
  title: 'Molecules / Members Avatars',
  component: MembersAvatars,
};

export const Normal = () => (
  <MembersAvatars
    members={createTeamResponseMembers({
      teamMembers: number('Number of members', 6),
    })}
    fullListRoute={text('Full List Route', 'someUrl')}
  />
);
