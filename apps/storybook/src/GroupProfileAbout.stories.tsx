import React from 'react';
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
          }).leaders.map(({ user, role }) => ({
            user: {
              ...user,
              teams: user.teams.map((team) => ({ ...team, href: '#' })),
            },
            role,
            href: '#',
            teams: user.teams.map((team) => ({ ...team, href: '#' })),
          }))
        : []
    }
    teams={
      boolean('Has Teams', true)
        ? createGroupResponse({ teamsCount: 2 }).teams.map((team) => ({
            ...team,
            href: '#',
          }))
        : []
    }
  />
);
