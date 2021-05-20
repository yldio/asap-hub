import { TeamProfileWorkspace } from '@asap-hub/react-components';
import { createTeamResponse } from '@asap-hub/fixtures';

export default {
  title: 'Templates / Team Profile / Workspace',
  component: TeamProfileWorkspace,
};

export const Normal = () => (
  <TeamProfileWorkspace
    {...createTeamResponse()}
    tools={[
      {
        name: 'My Tool',
        url: 'https://example.com/tool',
        description: 'Tool Description',
      },
    ]}
  />
);
