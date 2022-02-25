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
    description={
      boolean('Long description', true)
        ? "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        : 'A short description'
    }
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
