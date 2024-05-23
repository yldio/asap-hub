import { CaptionItem } from '@asap-hub/react-components';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof CaptionItem> = {
  title: 'Molecules / CaptionItem',
  component: CaptionItem,
  argTypes: {
    label: { control: 'text' },
    belowAverageMin: { control: 'number' },
    belowAverageMax: { control: 'number' },
    averageMin: { control: 'number' },
    averageMax: { control: 'number' },
    aboveAverageMin: { control: 'number' },
    aboveAverageMax: { control: 'number' },
  },
};

type Story = StoryObj<typeof CaptionItem>;
export const Normal: Story = {
  args: {
    label: 'ASAP Output',
    belowAverageMin: 0,
    belowAverageMax: 1,
    averageMin: 2,
    averageMax: 3,
    aboveAverageMin: 4,
    aboveAverageMax: 10,
  },
};

export const NegativeBelowAverageMax: Story = {
  args: {
    label: 'ASAP Output',
    belowAverageMin: 0,
    belowAverageMax: -1,
    averageMin: 0,
    averageMax: 2,
    aboveAverageMin: 3,
    aboveAverageMax: 6,
  },
};

export default meta;
