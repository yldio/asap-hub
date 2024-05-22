import { CaptionCard, CaptionItem } from '@asap-hub/react-components';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof CaptionCard> = {
  title: 'Organisms / CaptionCard',
  component: CaptionCard,
  argTypes: {
    children: { control: false },
  },
};

type Story = StoryObj<typeof CaptionCard>;
export const Normal: Story = {
  args: {
    children: (
      <>
        <CaptionItem
          label="Articles"
          belowAverageMin={0}
          belowAverageMax={1}
          averageMin={2}
          averageMax={4}
          aboveAverageMin={5}
          aboveAverageMax={10}
        />
        <CaptionItem
          label="Bioinformatics"
          belowAverageMin={2}
          belowAverageMax={3}
          averageMin={4}
          averageMax={7}
          aboveAverageMin={8}
          aboveAverageMax={20}
        />
        <CaptionItem
          label="Datasets"
          belowAverageMin={0}
          belowAverageMax={1}
          averageMin={2}
          averageMax={4}
          aboveAverageMin={5}
          aboveAverageMax={10}
        />
        <CaptionItem
          label="Lab Resources"
          belowAverageMin={2}
          belowAverageMax={5}
          averageMin={6}
          averageMax={9}
          aboveAverageMin={10}
          aboveAverageMax={13}
        />
        <CaptionItem
          label="Protocols"
          belowAverageMin={0}
          belowAverageMax={1}
          averageMin={2}
          averageMax={9}
          aboveAverageMin={10}
          aboveAverageMax={14}
        />
      </>
    ),
  },
};

export default meta;
