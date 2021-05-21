import { GroupProfileAbout } from '@asap-hub/react-components';
import { createGroupResponse } from '@asap-hub/fixtures';
import { boolean } from '@storybook/addon-knobs';

export default {
  title: 'Templates / Group Profile / About',
  component: GroupProfileAbout,
};

export const Normal = () => (
  <GroupProfileAbout
    {...createGroupResponse()}
    leaders={
      boolean('Has Leaders', true)
        ? createGroupResponse({
            leadPiCount: 2,
            projectManagerCount: 2,
          }).leaders.map(({ user }) => ({
            user,
            role: boolean('Has PMs', true) ? 'Project Manager' : 'Chair',
          }))
        : []
    }
    teams={
      boolean('Has Teams', true)
        ? createGroupResponse({ teamsCount: 2 }).teams
        : []
    }
  />
);
