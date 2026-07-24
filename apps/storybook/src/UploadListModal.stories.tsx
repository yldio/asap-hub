import { UploadListModal, UploadListResult } from '@asap-hub/react-components';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StaticRouter } from 'react-router';

const meta: Meta<typeof UploadListModal> = {
  title: 'Organisms / Events / Upload List Modal',
  component: UploadListModal,
  argTypes: {
    onUploadList: { control: false },
    onAddAttendees: { control: false },
    onBack: { control: false },
  },
  decorators: [
    (Story) => (
      <StaticRouter location="/">
        <Story />
      </StaticRouter>
    ),
  ],
};

type Story = StoryObj<typeof UploadListModal>;

// Simulate a parse round-trip so the "+ Add" loading spinner is visible.
const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

// Click "Add" and choose any .csv/.xlsx file to move from the empty step to the
// populated review step, then expand each section to inspect the teams.
const fullResult: UploadListResult = {
  matched: [
    {
      teamId: 'm1',
      teamName: 'Aguzzi',
      attended: true,
      teamType: 'Discovery Team',
    },
    {
      teamId: 'm2',
      teamName: 'Alessi',
      attended: true,
      teamType: 'Resource Team',
    },
    {
      teamId: 'm3',
      teamName: 'Chen',
      attended: true,
      teamType: 'Discovery Team',
    },
  ],
  alreadyInCount: 2,
  unmatched: [
    {
      name: 'Imagimg',
      suggestion: {
        teamId: 's1',
        teamName: 'Imaging',
        teamType: 'Discovery Team',
      },
    },
    { name: 'Data Scince' },
  ],
};

const commonArgs = {
  onAddAttendees: () => undefined,
  onBack: () => undefined,
  onDismiss: () => undefined,
};

export const Default: Story = {
  args: {
    ...commonArgs,
    onUploadList: async () => {
      await delay(1000);
      return fullResult;
    },
  },
};

export const AllMatched: Story = {
  args: {
    ...commonArgs,
    onUploadList: async () => {
      await delay(1000);
      return { ...fullResult, unmatched: [] };
    },
  },
};

export const NoMatches: Story = {
  args: {
    ...commonArgs,
    onUploadList: async () => {
      await delay(1000);
      return {
        matched: [],
        alreadyInCount: 0,
        unmatched: fullResult.unmatched,
      };
    },
  },
};

// Choose any file to trigger the "file too large" validation copy.
export const FileSizeError: Story = {
  args: {
    ...commonArgs,
    maxFileSizeMb: 0,
    onUploadList: async () => fullResult,
  },
};

export default meta;
