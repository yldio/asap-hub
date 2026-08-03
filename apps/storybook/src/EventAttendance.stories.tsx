import {
  EditEventAttendanceModal,
  EventAttendance,
} from '@asap-hub/react-components';
import type {
  AttendanceSearchOption,
  EventAttendanceTeam,
} from '@asap-hub/react-components';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
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
    onExport: () => undefined,
    onEdit: () => undefined,
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
    onExport: () => undefined,
    onEdit: () => undefined,
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
    onExport: () => undefined,
    onEdit: () => undefined,
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

const editInterestGroups = [
  { id: 'ig1', name: 'Alpha Synuclein' },
  { id: 'ig2', name: 'Mitochondria' },
];

const loadSearchOptions = async (
  inputValue: string,
): Promise<AttendanceSearchOption[]> =>
  [
    {
      value: 'searched-1',
      label: 'Searched Team',
      optionType: 'team' as const,
      teamType: 'Discovery Team' as const,
    },
    {
      value: 'searched-group-1',
      label: 'Searched Group',
      optionType: 'interestGroup' as const,
      teams: [
        { teamId: 'sgt-1', teamName: 'Group Search Team', attended: true },
      ],
    },
  ].filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase()),
  );

const onSelectInterestGroup = async (
  interestGroupId: string,
): Promise<EventAttendanceTeam[]> => [
  {
    teamId: `${interestGroupId}-team-1`,
    teamName: `${interestGroupId} Team A`,
    attended: true,
    teamType: 'Discovery Team',
  },
];

// Composes the read-only card with the edit modal so Save updates the card —
// open the pencil, change attendance, and Save to see the card refresh.
export const EditAndSave: Story = {
  render: () => {
    const [attendanceTeams, setAttendanceTeams] =
      useState<EventAttendanceTeam[]>(teams);
    const [isEditing, setIsEditing] = useState(false);

    return (
      <>
        <EventAttendance
          teamsAttended={attendanceTeams.filter((team) => team.attended).length}
          teamsTotal={attendanceTeams.length}
          teams={attendanceTeams}
          onExport={() => undefined}
          onEdit={() => setIsEditing(true)}
        />
        {isEditing && (
          <EditEventAttendanceModal
            teams={attendanceTeams}
            interestGroups={editInterestGroups}
            loadSearchOptions={loadSearchOptions}
            onSelectInterestGroup={onSelectInterestGroup}
            onUploadList={async () => ({
              matched: [
                {
                  teamId: 'uploaded-1',
                  teamName: 'Aguzzi',
                  attended: true,
                  teamType: 'Discovery Team',
                },
              ],
              alreadyInCount: 0,
              unmatched: [{ name: 'Data Scince' }],
            })}
            onSave={(updated) => {
              setAttendanceTeams(updated);
              setIsEditing(false);
            }}
            onDismiss={() => setIsEditing(false)}
          />
        )}
      </>
    );
  },
};

export default meta;
