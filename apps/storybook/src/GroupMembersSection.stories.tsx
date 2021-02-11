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
      (user, userIndex) => ({
        user: {
          ...user,
          teams: user.teams.map((team) => ({ ...team, href: `#t${team.id}` })),
        },
        role: userIndex % 3 ? 'Chair' : 'Project Manager',
        href: `#u${userIndex}`,
        teams: Array(number('Number of Leader Teams', 1))
          .fill(null)
          .map((_, teamIndex) => ({
            displayName: `${teamIndex + 1}`,
            href: `#t${teamIndex}`,
          })),
      }),
    )}
    teams={createListTeamResponse(
      number('Number of Teams', 6),
    ).items.map((team, teamIndex) => ({ ...team, href: `#t${teamIndex}` }))}
  />
);
