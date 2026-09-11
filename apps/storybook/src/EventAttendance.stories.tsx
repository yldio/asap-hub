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
    isFromInterestGroup: true,
  },
  {
    teamId: 't2',
    teamName: 'De Camilli',
    attended: true,
    teamType: 'Discovery Team' as const,
    isFromInterestGroup: true,
  },
  {
    teamId: 't3',
    teamName: 'Edwards',
    attended: true,
    teamType: 'Resource Team' as const,
    isFromInterestGroup: true,
  },
  {
    teamId: 't4',
    teamName: 'Ferguson',
    attended: true,
    teamType: 'Resource Team' as const,
    isFromInterestGroup: true,
  },
  {
    teamId: 't5',
    teamName: 'Herzog',
    attended: false,
    teamType: 'Resource Team' as const,
    isFromInterestGroup: true,
  },
  {
    teamId: 't6',
    teamName: 'Lippincott-Schwartz',
    attended: false,
    teamType: 'Discovery Team' as const,
  },
];

export const Default: Story = {
  args: {
    teams,
    interestGroupName: 'Alpha Synuclein',
    onExport: () => undefined,
    onEdit: () => undefined,
  },
};

export const ReadOnly: Story = {
  args: {
    teams,
    interestGroupName: 'Alpha Synuclein',
  },
};

// Every row came from an upload, so there is no metric tile to show.
export const AdditionalTeamsOnly: Story = {
  args: {
    teams: teams.map((team) => ({ ...team, isFromInterestGroup: false })),
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
  isFromInterestGroup: index < 9,
}));

export const ManyTeams: Story = {
  args: {
    teams: manyTeams,
    interestGroupName: 'Alpha Synuclein',
    onExport: () => undefined,
    onEdit: () => undefined,
  },
};

export const Empty: Story = {
  args: {
    teams: [],
  },
};

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
          teams={attendanceTeams}
          interestGroupName="Alpha Synuclein"
          onExport={() => undefined}
          onEdit={() => setIsEditing(true)}
        />
        {isEditing && (
          <EditEventAttendanceModal
            teams={attendanceTeams}
            interestGroupName="Alpha Synuclein"
            loadSearchOptions={loadSearchOptions}
            onUploadList={async () => ({
              matched: [
                {
                  teamId: 'uploaded-1',
                  teamName: 'Aguzzi',
                  attended: true,
                  teamType: 'Discovery Team',
                },
              ],
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
