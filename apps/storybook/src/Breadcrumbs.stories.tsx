import { Meta, StoryObj } from '@storybook/react-vite';

import { Breadcrumbs } from '@asap-hub/react-components';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Molecules / Navigation / Breadcrumbs',
  component: Breadcrumbs,
  argTypes: {
    homeHref: {
      control: { type: 'text' },
    },
    items: {
      control: { type: 'object' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Breadcrumbs>;

export const HomeOnly: Story = {
  args: {
    homeHref: '/',
  },
};

export const ProjectDetail: Story = {
  args: {
    homeHref: '/',
    items: [
      { label: 'Discovery Projects', href: '/projects' },
      { label: 'Alpha-Synuclein Origins' },
    ],
  },
};

export const ProjectSubpage: Story = {
  args: {
    homeHref: '/',
    items: [
      { label: 'Discovery Projects', href: '/projects' },
      { label: 'Alpha-Synuclein Origins', href: '/projects/42' },
      { label: 'Share a Compliance Report' },
    ],
  },
};

export const NonLinkableIntermediate: Story = {
  args: {
    homeHref: '/',
    items: [
      { label: 'Discovery Projects', href: '/projects' },
      { label: 'Alpha-Synuclein Origins' },
      { label: 'Submit Revised Manuscript' },
    ],
  },
};

export const DeepPath: Story = {
  args: {
    homeHref: '/',
    items: [
      { label: 'Level 1', href: '/level-1' },
      { label: 'Level 2', href: '/level-2' },
      { label: 'Level 3', href: '/level-3' },
      { label: 'Level 4', href: '/level-4' },
      { label: 'Level 5', href: '/level-5' },
      { label: 'Level 6' },
    ],
  },
};
