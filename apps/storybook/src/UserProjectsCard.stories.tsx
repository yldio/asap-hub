import { UserProjectsCard } from '@asap-hub/react-components';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { UserProjectMembership } from '@asap-hub/model';

const meta: Meta<typeof UserProjectsCard> = {
  title: 'Organisms / UserProjectsCard',
  component: UserProjectsCard,
  argTypes: {
    projects: { control: false },
  },
};

type Story = StoryObj<typeof UserProjectsCard>;

const sampleProjects: UserProjectMembership[] = [
  {
    id: 'discovery-project-1',
    title: 'Understanding Genetic Mechanisms in PD',
    projectType: 'Discovery Project',
    status: 'Active',
  },
  {
    id: 'resource-project-1',
    title: 'PD Biobank Resource',
    projectType: 'Resource Project',
    status: 'Completed',
  },
  {
    id: 'trainee-project-1',
    title: 'Molecular Biology Training Program',
    projectType: 'Trainee Project',
    status: 'Active',
  },
];

const manyProjects: UserProjectMembership[] = [
  {
    id: 'discovery-project-1',
    title: 'Understanding Genetic Mechanisms in PD',
    projectType: 'Discovery Project',
    status: 'Active',
  },
  {
    id: 'discovery-project-2',
    title: 'Biomarker Development for Early Detection',
    projectType: 'Discovery Project',
    status: 'Active',
  },
  {
    id: 'discovery-project-3',
    title: 'Exploring Environmental Factors in PD',
    projectType: 'Discovery Project',
    status: 'Completed',
  },
  {
    id: 'resource-project-1',
    title: 'PD Biobank Resource',
    projectType: 'Resource Project',
    status: 'Completed',
  },
  {
    id: 'resource-project-2',
    title: 'Open-Source Analysis Pipeline',
    projectType: 'Resource Project',
    status: 'Closed',
  },
  {
    id: 'resource-project-3',
    title: 'Standardized Clinical Assessment Protocol',
    projectType: 'Resource Project',
    status: 'Active',
  },
  {
    id: 'trainee-project-1',
    title: 'Molecular Biology Training Program',
    projectType: 'Trainee Project',
    status: 'Active',
  },
  {
    id: 'trainee-project-2',
    title: 'Investigating Alpha-Synuclein Aggregation',
    projectType: 'Trainee Project',
    status: 'Completed',
  },
  {
    id: 'trainee-project-3',
    title: 'Dopaminergic Neuron Vulnerability Study',
    projectType: 'Trainee Project',
    status: 'Active',
  },
];

export const EmptyState: Story = {
  args: {
    projects: [],
  },
};

export const WithData: Story = {
  args: {
    projects: sampleProjects,
  },
};

export const WithManyProjectsCollapsed: Story = {
  args: {
    projects: manyProjects,
  },
  parameters: {
    docs: {
      description: {
        story:
          'When there are more than 6 projects, the component initially shows only the first 6 projects with a "Show more ↓" button. This is the default collapsed state.',
      },
    },
  },
};

export const WithManyProjectsExpanded: Story = {
  args: {
    projects: manyProjects,
  },
  parameters: {
    docs: {
      description: {
        story:
          'After clicking "Show more ↓", all projects are displayed and the button changes to "Show less ↑". Click "Show less" to collapse back to the initial state. In Storybook, you can interact with the component to toggle between collapsed and expanded states.',
      },
    },
  },
};

export default meta;
