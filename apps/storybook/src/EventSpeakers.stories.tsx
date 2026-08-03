import {
  EditEventSpeakersModal,
  EventSpeakers,
} from '@asap-hub/react-components';
import type {
  SpeakerGroup,
  SpeakerSearchOption,
} from '@asap-hub/react-components';
import { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { StaticRouter } from 'react-router';

import { CenterDecorator } from './layout';

const noop = () => undefined;

type SpeakerTeamGroup = Extract<SpeakerGroup, { variant: 'team' }>;

const roles = ['Data Manager', 'Multiple roles', 'Lead PI', 'Project Manager'];

const buildTeams = (
  numberOfTeams: number,
  membersPerTeam: number,
  teamsSharingFindings: number,
  hasInactiveTeam: boolean,
): SpeakerTeamGroup[] =>
  Array.from({ length: numberOfTeams }, (_, teamIndex) => ({
    id: `team-${teamIndex}`,
    variant: 'team',
    teamName: `Team ${teamIndex + 1}`,
    teamType:
      teamIndex % 2 === 0
        ? ('Discovery Team' as const)
        : ('Resource Team' as const),
    isTeamInactive: hasInactiveTeam && teamIndex === 2,
    // The first N teams share findings — drives the preliminary-findings %.
    preliminaryFindingsShared: teamIndex < teamsSharingFindings,
    users: Array.from({ length: membersPerTeam }, (_m, memberIndex) => ({
      id: `user-${teamIndex}-${memberIndex}`,
      displayName: `John Doe ${teamIndex + 1}.${memberIndex + 1}`,
      roles: [roles[memberIndex % roles.length] as string],
      isAlumni: memberIndex === 1,
    })),
  }));

const buildExternalGroup = (
  numberOfExternalUsers: number,
  externalSharedFindings: boolean,
): SpeakerGroup | undefined =>
  numberOfExternalUsers > 0
    ? {
        id: 'external',
        variant: 'external',
        preliminaryFindingsShared: externalSharedFindings,
        users: Array.from({ length: numberOfExternalUsers }, (_, index) => ({
          id: `ext-${index}`,
          displayName: `External user ${index + 1}`,
        })),
      }
    : undefined;

type ControlArgs = {
  numberOfTeams: number;
  membersPerTeam: number;
  teamsSharingFindings: number;
  numberOfExternalUsers: number;
  externalSharedFindings: boolean;
  isEditor: boolean;
  hasFinished: boolean;
  longTeamNameExample: boolean;
  hasInactiveTeam: boolean;
};

const meta: Meta<ControlArgs> = {
  title: 'Organisms / Events / Speakers',
  decorators: [
    (Story) => (
      <StaticRouter location="/">
        <Story />
      </StaticRouter>
    ),
    CenterDecorator,
  ],
  argTypes: {
    numberOfTeams: { control: { type: 'range', min: 0, max: 20, step: 1 } },
    membersPerTeam: { control: { type: 'range', min: 0, max: 8, step: 1 } },
    teamsSharingFindings: {
      control: { type: 'range', min: 0, max: 20, step: 1 },
      description:
        'How many teams shared preliminary findings — drives the circle % (teams sharing ÷ number of teams). Set equal to "number of teams" for 100% (green), 0 for 0% (purple).',
    },
    numberOfExternalUsers: {
      control: { type: 'range', min: 0, max: 6, step: 1 },
    },
    externalSharedFindings: {
      control: 'boolean',
      description: 'Tick/cross on the External Users row',
    },
    isEditor: {
      control: 'boolean',
      description: 'PM/editor — shows Download & Edit actions',
    },
    hasFinished: {
      control: 'boolean',
      description: 'Whether the event has already taken place',
    },
    longTeamNameExample: {
      control: 'boolean',
      description:
        'Rename the first team to a long single word to demo the horizontal-scroll + "Preliminary Findings" header behaviour',
    },
    hasInactiveTeam: {
      control: 'boolean',
      description: 'Mark the third team as inactive (shows the inactive badge)',
    },
  },
  render: ({
    numberOfTeams,
    membersPerTeam,
    teamsSharingFindings,
    numberOfExternalUsers,
    externalSharedFindings,
    isEditor,
    hasFinished,
    longTeamNameExample,
    hasInactiveTeam,
  }) => {
    const teams = buildTeams(
      numberOfTeams,
      membersPerTeam,
      teamsSharingFindings,
      hasInactiveTeam,
    );
    if (longTeamNameExample && teams[0]) {
      teams[0] = { ...teams[0], teamName: 'Sundaravadivelu' };
    }
    const externalGroup = buildExternalGroup(
      numberOfExternalUsers,
      externalSharedFindings,
    );
    return (
      <EventSpeakers
        groups={externalGroup ? [...teams, externalGroup] : teams}
        hasFinished={hasFinished}
        onEdit={isEditor ? noop : undefined}
        onExport={isEditor ? noop : undefined}
        onAddSpeaker={isEditor ? noop : undefined}
      />
    );
  },
};

export default meta;

type Story = StoryObj<ControlArgs>;

export const Playground: Story = {
  args: {
    numberOfTeams: 3,
    membersPerTeam: 3,
    teamsSharingFindings: 2,
    numberOfExternalUsers: 2,
    externalSharedFindings: false,
    isEditor: true,
    hasFinished: true,
    longTeamNameExample: false,
    hasInactiveTeam: false,
  },
};

export const NonAdmin: Story = {
  args: { ...Playground.args, isEditor: false },
};

export const Upcoming: Story = {
  args: { ...Playground.args, hasFinished: false },
};

export const Overflow: Story = {
  args: {
    ...Playground.args,
    numberOfTeams: 14,
    teamsSharingFindings: 9,
    longTeamNameExample: true,
  },
};

export const FindingsFull: Story = {
  args: { ...Playground.args, numberOfTeams: 5, teamsSharingFindings: 5 },
};

export const FindingsNone: Story = {
  args: { ...Playground.args, teamsSharingFindings: 0 },
};

export const EmptyEditorUpcoming: Story = {
  args: {
    numberOfTeams: 0,
    membersPerTeam: 0,
    teamsSharingFindings: 0,
    numberOfExternalUsers: 0,
    externalSharedFindings: false,
    isEditor: true,
    hasFinished: false,
  },
};

export const EmptyEditorPast: Story = {
  args: { ...EmptyEditorUpcoming.args, hasFinished: true },
};

export const EmptyReadOnly: Story = {
  args: { ...EmptyEditorUpcoming.args, isEditor: false },
};

// End-to-end wiring: the card and the edit modal share one SpeakerGroup[] —
// open the pencil, add/remove speakers or toggle findings, and Save to see the
// card refresh. onSave writes the modal's result straight back, no adapter.
const editAndSaveInitial: SpeakerGroup[] = [
  {
    id: 'team-1',
    variant: 'team',
    teamName: 'Aguzzi',
    teamType: 'Discovery Team',
    preliminaryFindingsShared: true,
    users: [
      { id: 'user-1', displayName: 'Jane Doe', roles: ['Lead PI'] },
      { id: 'user-2', displayName: 'John Smith', roles: ['Data Manager'] },
    ],
  },
  {
    id: 'team-2',
    variant: 'team',
    teamName: 'Herzog',
    teamType: 'Resource Team',
    preliminaryFindingsShared: false,
    users: [
      {
        id: 'user-3',
        displayName: 'Priya Patel',
        roles: ['Project Manager', 'Data Manager'],
      },
    ],
  },
  {
    id: 'external',
    variant: 'external',
    preliminaryFindingsShared: false,
    users: [{ id: 'ext-1', displayName: 'Sam Rivera' }],
  },
];

const editAndSaveSearchResults: SpeakerSearchOption[] = [
  {
    value: 'user-jordan',
    label: 'Jordan Lee',
    user: {
      userId: 'user-jordan',
      displayName: 'Jordan Lee',
      teamOptions: [
        { teamId: 'team-3', teamName: 'Chen', role: 'Data Manager' },
      ],
    },
  },
  {
    value: 'user-alex',
    label: 'Alex Kim',
    user: {
      userId: 'user-alex',
      displayName: 'Alex Kim',
      teamOptions: [
        { teamId: 'team-1', teamName: 'Aguzzi', role: 'Project Manager' },
        { teamId: 'team-3', teamName: 'Chen', role: 'Trainee' },
      ],
    },
  },
];

const loadEditAndSaveSearchOptions = async (inputValue: string) =>
  editAndSaveSearchResults.filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase()),
  );

export const EditAndSave: Story = {
  render: () => {
    const [groups, setGroups] = useState<SpeakerGroup[]>(editAndSaveInitial);
    const [isEditing, setIsEditing] = useState(false);

    return (
      <>
        <EventSpeakers
          groups={groups}
          hasFinished
          onExport={noop}
          onEdit={() => setIsEditing(true)}
        />
        {isEditing && (
          <EditEventSpeakersModal
            groups={groups}
            loadSearchOptions={loadEditAndSaveSearchOptions}
            onSave={(updated) => {
              setGroups(updated);
              setIsEditing(false);
            }}
            onDismiss={() => setIsEditing(false)}
          />
        )}
      </>
    );
  },
};
