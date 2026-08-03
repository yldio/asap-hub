import { EditEventSpeakersModal } from '@asap-hub/react-components';
import type { SpeakerGroup } from '@asap-hub/react-components';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof EditEventSpeakersModal> = {
  title: 'Organisms / Events / Edit Speakers Modal',
  component: EditEventSpeakersModal,
};

type Story = StoryObj<typeof EditEventSpeakersModal>;

// Search returns a mix of: a user with a single team (added directly), a user
// with multiple teams (shows the "pick a team" pending card), and — for any
// unmatched text — a creatable "External User" option. Type any letter in the
// search field to see them.
const searchResults = [
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

const loadSearchOptions = async (inputValue: string) =>
  searchResults.filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase()),
  );

const populatedGroups: SpeakerGroup[] = [
  {
    id: 'team-1',
    variant: 'team',
    teamName: 'Aguzzi',
    teamType: 'Discovery Team',
    isTeamInactive: true,
    preliminaryFindingsShared: true,
    users: [
      {
        id: 'user-1',
        displayName: 'Jane Doe',
        roles: ['Lead PI'],
        isAlumni: true,
      },
      { id: 'user-2', displayName: 'John Smith', roles: ['Data Manager'] },
    ],
  },
  {
    id: 'team-2',
    variant: 'team',
    teamName: 'Herzog',
    teamType: 'Resource Team',
    preliminaryFindingsShared: true,
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

export const AddSpeakers: Story = {
  args: {
    groups: [],
    loadSearchOptions,
    onSave: () => undefined,
    onDismiss: () => undefined,
  },
};

export const EditSpeakers: Story = {
  args: {
    groups: populatedGroups,
    loadSearchOptions,
    onSave: () => undefined,
    onDismiss: () => undefined,
  },
};

export default meta;
