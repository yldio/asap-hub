import { TeamLeadershipMetrics } from '@asap-hub/react-components';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { CenterDecorator } from './layout';

const meta: Meta<typeof TeamLeadershipMetrics> = {
  title: 'Organisms / Team Leadership Metrics',
  component: TeamLeadershipMetrics,
  decorators: [
    (Story) => (
      <div>
        <Story />
      </div>
    ),
    CenterDecorator,
  ],
};

type Story = StoryObj<typeof TeamLeadershipMetrics>;

export const Default: Story = {
  args: { workingGroupLead: true, interestGroupLead: false },
};

export default meta;
