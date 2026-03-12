import type { Milestone } from '@asap-hub/model';

/**
 * Mock milestones for the Project Detail Milestones tab.
 * Replace with real API data when backend is ready.
 */
export const mockMilestones: ReadonlyArray<Milestone> = [
  {
    id: 'ms-1',
    description:
      'Complete literature review and establish baseline metrics for alpha-synuclein aggregation in dopaminergic neurons.',
    status: 'Complete',
    aims: '1',
  },
  {
    id: 'ms-2',
    description:
      'Develop and validate imaging protocols for protein misfolding assessment. Finalise standard operating procedures.',
    status: 'In Progress',
    aims: '1,2',
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
      'Multi-site replication of biomarker candidates and submission of final project report.',
    status: 'Terminated',
    aims: '3',
  },
];
