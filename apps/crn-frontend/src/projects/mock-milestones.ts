import type { Milestone } from '@asap-hub/model';

/**
 * Mock milestones for the Project Detail Milestones tab.
 * Replace with real API data when backend is ready.
 */
export const mockMilestones: ReadonlyArray<Milestone> = [
  {
    id: 'ms-1',
    description:
      'Complete literature review and establish baseline metrics for alpha-synuclein aggregation in dopaminergic neurons. Complete literature review and establish baseline metrics for alpha-synuclein aggregation in dopaminergic neurons.',
    status: 'Complete',
    aims: '1',
    relatedArticles: [
      {
        id: 'ro-1',
        title: 'Alpha-synuclein aggregation in PD models',
        href: '/shared-research/ro-1',
        type: 'Preprint',
      },
      {
        id: 'ro-2',
        title: 'Dopaminergic neuron baseline metrics study',
        href: '/shared-research/ro-2',
        type: 'Published',
      },
    ],
  },
  {
    id: 'ms-2',
    description:
      'Develop and validate imaging protocols for protein misfolding assessment. Finalise standard operating procedures.',
    status: 'In Progress',
    aims: '1,2',
    relatedArticles: [
      {
        id: 'ro-3',
        title: 'Protein misfolding imaging protocol validation',
        href: '/shared-research/ro-3',
        type: 'Preprint',
      },
    ],
  },
  {
    id: 'ms-3',
    description:
      'Run biochemical assays in Parkinson models and document findings. Prepare interim report for review.',
    status: 'Pending',
    aims: '2',
  },
  {
    id: 'ms-4',
    description:
      'Complete gene therapy pilot in synucleinopathy models and analyse therapeutic targeting outcomes.',
    status: 'Pending',
    aims: '2,3,4,5,6',
  },
  {
    id: 'ms-5',
    description:
      'Multi-site replication of biomarker candidates and submission of final project report. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    status: 'Terminated',
    aims: '3',
  },
];
