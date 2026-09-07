import { HubResearchOutputsCard } from '@asap-hub/react-components';
import type { HubResearchOutputRow } from '@asap-hub/react-components';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { CenterDecorator } from './layout';

const meta: Meta<typeof HubResearchOutputsCard> = {
  title: 'Organisms / Hub Research Outputs Card',
  component: HubResearchOutputsCard,
  decorators: [
    (Story) => (
      <div>
        <Story />
      </div>
    ),
    CenterDecorator,
  ],
};

type Story = StoryObj<typeof HubResearchOutputsCard>;

const rows: HubResearchOutputRow[] = [
  { outputType: 'Articles', numberOfOutputs: 42, publicPercentage: 95 },
  { outputType: 'Code/Software', numberOfOutputs: 18, publicPercentage: 85 },
  { outputType: 'Datasets', numberOfOutputs: 27, publicPercentage: 50 },
  { outputType: 'Lab Materials', numberOfOutputs: 12, publicPercentage: 100 },
  { outputType: 'Protocols', numberOfOutputs: 8, publicPercentage: 40 },
];

export const WithData: Story = {
  args: {
    rows,
  },
};

export const LimitedData: Story = {
  args: {
    rows: [
      { outputType: 'Articles', numberOfOutputs: 0, publicPercentage: null },
      {
        outputType: 'Code/Software',
        numberOfOutputs: 0,
        publicPercentage: null,
      },
      { outputType: 'Datasets', numberOfOutputs: 3, publicPercentage: 80 },
      { outputType: 'Lab Materials', numberOfOutputs: 1, publicPercentage: 90 },
      { outputType: 'Protocols', numberOfOutputs: 0, publicPercentage: null },
    ],
  },
};

export default meta;
