import {
  EventSpeakers,
  EventSpeakerTeamRow,
  EventSpeakerExternalRow,
} from '@asap-hub/react-components';
import { Meta, StoryObj } from '@storybook/react-vite';
import { StaticRouter } from 'react-router';

import { CenterDecorator } from './layout';

const noop = () => undefined;

const roles = ['Data Manager', 'Multiple roles', 'Lead PI', 'Project Manager'];

const buildTeams = (
  numberOfTeams: number,
  membersPerTeam: number,
  teamsSharingFindings: number,
): EventSpeakerTeamRow[] =>
  Array.from({ length: numberOfTeams }, (_, teamIndex) => ({
    teamId: `team-${teamIndex}`,
    teamName: `Team ${teamIndex + 1}`,
    teamType:
      teamIndex % 2 === 0 ? ('discovery' as const) : ('resource' as const),
    isTeamInactive: teamIndex === 2,
    // The first N teams share findings — drives the preliminary-findings %.
    sharedPreliminaryFindings: teamIndex < teamsSharingFindings,
    members: Array.from({ length: membersPerTeam }, (_m, memberIndex) => ({
      id: `user-${teamIndex}-${memberIndex}`,
      firstName: 'John',
      lastName: 'Doe',
      displayName: `John Doe ${teamIndex + 1}.${memberIndex + 1}`,
      role: roles[memberIndex % roles.length] as string,
      isAlumni: memberIndex === 1,
    })),
  }));

const buildExternalUsers = (
  numberOfExternalUsers: number,
  externalSharedFindings: boolean,
): EventSpeakerExternalRow | undefined =>
  numberOfExternalUsers > 0
    ? {
        sharedPreliminaryFindings: externalSharedFindings,
        members: Array.from({ length: numberOfExternalUsers }, (_, index) => ({
          name: `External user ${index + 1}`,
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
  },
  render: ({
    numberOfTeams,
    membersPerTeam,
    teamsSharingFindings,
    numberOfExternalUsers,
    externalSharedFindings,
    isEditor,
    hasFinished,
  }) => (
    <EventSpeakers
      teams={buildTeams(numberOfTeams, membersPerTeam, teamsSharingFindings)}
      externalUsers={buildExternalUsers(
        numberOfExternalUsers,
        externalSharedFindings,
      )}
      hasFinished={hasFinished}
      onEdit={isEditor ? noop : undefined}
      onExport={isEditor ? noop : undefined}
      onAddSpeaker={isEditor ? noop : undefined}
    />
  ),
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
  },
};

export const NonAdmin: Story = {
  args: { ...Playground.args, isEditor: false },
};

export const Upcoming: Story = {
  args: { ...Playground.args, hasFinished: false },
};

export const Overflow: Story = {
  args: { ...Playground.args, numberOfTeams: 14, teamsSharingFindings: 9 },
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
