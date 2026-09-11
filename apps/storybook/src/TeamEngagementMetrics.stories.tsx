import {
  TeamEngagementMetrics,
  TeamEngagementMetricsProps,
} from '@asap-hub/react-components';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { CenterDecorator } from './layout';

const meta: Meta<typeof TeamEngagementMetrics> = {
  title: 'Organisms / Team Engagement Metrics',
  component: TeamEngagementMetrics,
  decorators: [
    (Story) => (
      <div>
        <Story />
      </div>
    ),
    CenterDecorator,
  ],
};

type Story = StoryObj<typeof TeamEngagementMetrics>;

const props: TeamEngagementMetricsProps = {
  speakerDiversity: null,
  traineePresentations: null,
  meetingRepAttendance: null,
};

export const Default: Story = {
  args: props,
};

export const WithScores: Story = {
  args: {
    speakerDiversity: 95,
    traineePresentations: 84,
    meetingRepAttendance: 42,
  },
};

export default meta;
