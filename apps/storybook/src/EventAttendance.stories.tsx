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
    teamType: 'Discovery Team' as const,
  },
  {
    teamId: 't2',
    teamName: 'De Camilli',
    attended: true,
    teamType: 'Discovery Team' as const,
  },
  {
    teamId: 't3',
    teamName: 'Edwards',
    attended: true,
    teamType: 'Resource Team' as const,
  },
  {
    teamId: 't4',
    teamName: 'Ferguson',
    attended: true,
    teamType: 'Resource Team' as const,
  },
  {
    teamId: 't5',
    teamName: 'Herzog',
    attended: true,
    teamType: 'Resource Team' as const,
  },
  {
    teamId: 't6',
    teamName: 'Lippincott-Schwartz',
    attended: false,
    teamType: 'Discovery Team' as const,
  },
];

export const Increase: Story = {
  args: {
    teamsAttended: 5,
    teamsTotal: 6,
    sinceLastEvent: {
      count: 2,
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
      count: -1,
      teamsAttended: 6,
      teamsTotal: 6,
    },
  },
};

export const NoComparison: Story = {
  args: {
    teamsAttended: 5,
    teamsTotal: 6,
    teams,
  },
};

const teamTypes = ['Discovery Team', 'Resource Team'] as const;
const manyTeams = Array.from({ length: 14 }, (_, index) => ({
  teamId: `team-${index + 1}`,
  teamName: `Team ${index + 1}`,
  attended: index < 11,
  teamType: teamTypes[index % 2],
}));

export const ManyTeams: Story = {
  args: {
    teamsAttended: 11,
    teamsTotal: 14,
    sinceLastEvent: {
      count: 3,
      teamsAttended: 10,
      teamsTotal: 14,
    },
    teams: manyTeams,
  },
};

export const Empty: Story = {
  args: {
    teamsAttended: 0,
    teamsTotal: 0,
    teams: [],
    onAddAttendance: () => undefined,
  },
};

export const EmptyReadOnly: Story = {
  args: {
    teamsAttended: 0,
    teamsTotal: 0,
    teams: [],
  },
};

export default meta;
