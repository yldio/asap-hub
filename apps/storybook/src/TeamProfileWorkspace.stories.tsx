import React from 'react';
import { TeamProfileWorkspace } from '@asap-hub/react-components';
import { createTeamResponse } from '@asap-hub/fixtures';

export default {
  title: 'Templates / Team Profile / Workspace',
  component: TeamProfileWorkspace,
};

export const Normal = () => (
  <TeamProfileWorkspace
    {...createTeamResponse()}
    newToolHref="#"
    tools={[
      {
        name: 'My Tool',
        url: 'https://example.com/tool',
        editHref: '#',
        description: 'Tool Description',
      },
    ]}
  />
);
