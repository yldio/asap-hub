import { EventAttendance } from '@asap-hub/react-components';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StaticRouter } from 'react-router';

import { CenterDecorator } from './layout';

const meta: Meta<typeof EventAttendance> = {
  title: 'Organisms / Events / Attendance',
  component: EventAttendance,
  decorators: [
    (Story) => (
      <StaticRouter location="/">
        <Story />
      </StaticRouter>
    ),
    CenterDecorator,
  ],
};

type Story = StoryObj<typeof EventAttendance>;

const teams = [
  {
    teamId: 't1',
    teamName: 'Barbieri',
    attended: true,
    teamType: 'discovery' as const,
  },
  {
    teamId: 't2',
    teamName: 'De Camilli',
    attended: true,
    teamType: 'discovery' as const,
  },
  {
    teamId: 't3',
    teamName: 'Edwards',
    attended: true,
    teamType: 'resource' as const,
  },
  {
    teamId: 't4',
    teamName: 'Ferguson',
    attended: true,
    teamType: 'resource' as const,
  },
  {
    teamId: 't5',
    teamName: 'Herzog',
    attended: true,
    teamType: 'resource' as const,
  },
  {
    teamId: 't6',
    teamName: 'Lippincott-Schwartz',
    attended: false,
    teamType: 'discovery' as const,
  },
];

export const Increase: Story = {
  args: {
    attendancePercentage: 83,
    teamsAttended: 5,
    teamsTotal: 6,
    sinceLastEvent: {
      percentage: 12,
      teamsAttended: 4,
      teamsTotal: 6,
    },
    teams,
  },
};

export const Decrease: Story = {
  args: {
    ...Increase.args,
    sinceLastEvent: {
      percentage: -8,
      teamsAttended: 6,
      teamsTotal: 6,
    },
  },
};

export const NoComparison: Story = {
  args: {
    attendancePercentage: 83,
    teamsAttended: 5,
    teamsTotal: 6,
    teams,
  },
};

const teamTypes = ['discovery', 'resource'] as const;
const manyTeams = Array.from({ length: 14 }, (_, index) => ({
  teamId: `team-${index + 1}`,
  teamName: `Team ${index + 1}`,
  attended: index < 11,
  teamType: teamTypes[index % 2],
}));

export const ManyTeams: Story = {
  args: {
    attendancePercentage: 79,
    teamsAttended: 11,
    teamsTotal: 14,
    sinceLastEvent: {
      percentage: 6,
      teamsAttended: 10,
      teamsTotal: 14,
    },
    teams: manyTeams,
  },
};

export default meta;
