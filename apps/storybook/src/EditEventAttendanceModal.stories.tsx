import { EditEventAttendanceModal } from '@asap-hub/react-components';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StaticRouter } from 'react-router';

const meta: Meta<typeof EditEventAttendanceModal> = {
  title: 'Organisms / Events / Edit Attendance Modal',
  component: EditEventAttendanceModal,
  decorators: [
    (Story) => (
      <StaticRouter location="/">
        <Story />
      </StaticRouter>
    ),
  ],
};

type Story = StoryObj<typeof EditEventAttendanceModal>;

const teamTypes = ['Discovery Team', 'Resource Team'] as const;

// Search returns a mix of interest groups (which add several teams) and single
// teams — type any letter in the search field to see them.
const searchResults = [
  {
    value: 'ig-search-a',
    label: 'Alpha Synuclein',
    optionType: 'interestGroup' as const,
    teams: [
      { teamId: 'sga-1', teamName: 'Aguzzi', attended: true },
      { teamId: 'sga-2', teamName: 'Alessi', attended: true },
      { teamId: 'sga-3', teamName: 'Chen', attended: true },
    ],
  },
  {
    value: 'ig-search-b',
    label: 'Mitochondria',
    optionType: 'interestGroup' as const,
    teams: [
      { teamId: 'sgb-1', teamName: 'Dawson', attended: true },
      { teamId: 'sgb-2', teamName: 'Edwards', attended: true },
    ],
  },
  {
    value: 's1',
    label: 'Ferguson',
    optionType: 'team' as const,
    teamType: 'Discovery Team' as const,
  },
  {
    value: 's2',
    label: 'Herzog',
    optionType: 'team' as const,
    teamType: 'Resource Team' as const,
  },
  {
    value: 's3',
    label: 'Lippincott-Schwartz',
    optionType: 'team' as const,
    teamType: 'Discovery Team' as const,
  },
];

const loadSearchOptions = async (inputValue: string) =>
  searchResults.filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase()),
  );

// Six groups so desktop shows two columns of three (top-to-bottom, then a new
// column); mobile stacks them in a single column.
const interestGroups = [
  { id: 'ig1', name: 'Alpha Synuclein' },
  { id: 'ig2', name: 'Mitochondria' },
  { id: 'ig3', name: 'GBA1' },
  { id: 'ig4', name: 'LRRK2' },
  { id: 'ig5', name: 'Autophagy' },
  { id: 'ig6', name: 'Neuroinflammation' },
];

const teams = Array.from({ length: 6 }, (_, index) => ({
  teamId: `team-${index + 1}`,
  teamName: `Team ${index + 1}`,
  attended: index < 5,
  teamType: teamTypes[index % 2],
}));

const commonArgs = {
  interestGroups,
  loadSearchOptions,
  onSelectInterestGroup: async (interestGroupId: string) => [
    {
      teamId: `${interestGroupId}-team-1`,
      teamName: `${interestGroupId} Team A`,
      attended: true,
      teamType: 'Discovery Team' as const,
    },
    {
      teamId: `${interestGroupId}-team-2`,
      teamName: `${interestGroupId} Team B`,
      attended: true,
      teamType: 'Resource Team' as const,
    },
  ],
  onUploadList: async () => [
    {
      teamId: 'uploaded-1',
      teamName: 'Uploaded Team',
      attended: true,
      teamType: 'Resource Team' as const,
    },
  ],
  onSave: () => undefined,
  onDismiss: () => undefined,
};

export const AddAttendance: Story = {
  args: {
    ...commonArgs,
    teams: [],
  },
};

export const EditAttendance: Story = {
  args: {
    ...commonArgs,
    teams,
  },
};

export const NoOptionalSections: Story = {
  args: {
    loadSearchOptions,
    onSave: () => undefined,
    onDismiss: () => undefined,
    teams,
  },
};

export default meta;
