import React from 'react';
import {
  createListUserResponse,
  createListTeamResponse,
} from '@asap-hub/fixtures';
import { number } from '@storybook/addon-knobs';
import { GroupMembersSection } from '@asap-hub/react-components';

export default {
  title: 'Organisms / Group Profile / Members',
};

export const Normal = () => (
  <GroupMembersSection
    leaders={createListUserResponse(number('Number of Leaders', 6)).items.map(
      (user, i) => ({
        user,
        role: i % 3 ? 'Lead PI - Chair' : 'Project Manager',
      }),
    )}
    teams={createListTeamResponse(number('Number of Teams', 6)).items}
  />
);
