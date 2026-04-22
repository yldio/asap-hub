import {
  Milestone as MilestoneComponent,
  ResearchOutputOption,
} from '@asap-hub/react-components';
import { Milestone } from '@asap-hub/model';

export default {
  title: 'Organisms / Milestone',
  component: MilestoneComponent,
};

const mockLoadArticleOptions = (
  inputValue: string,
): Promise<ResearchOutputOption[]> =>
  Promise.resolve(
    [
      {
        value: '1',
        label: 'Alpha-synuclein aggregation study',
        documentType: 'Article',
        type: 'Preprint',
      },
      {
        value: '2',
        label: 'LRRK2 kinase inhibitor results',
        documentType: 'Article',
        type: 'Published',
      },
    ].filter((a) => a.label.toLowerCase().includes(inputValue.toLowerCase())),
  );

const mockFetchArticles = () => Promise.resolve([]);

const defaultProps = {
  isLead: true,
  loadArticleOptions: mockLoadArticleOptions,
  fetchLinkedArticles: mockFetchArticles,
  onSaveArticles: () => Promise.resolve(),
};

const createMilestone = (
  id: string,
  description: string,
  status: Milestone['status'],
  articleCount: number = 0,
): Milestone => ({
  id,
  description,
  status,
  articleCount,
});

const shortDescription = 'Complete initial research and literature review.';

const mediumDescription =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

const longDescription =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

// Status variations
export const StatusComplete = () => (
  <MilestoneComponent
    {...defaultProps}
    milestone={createMilestone('1', mediumDescription, 'Complete')}
  />
);

export const StatusInProgress = () => (
  <MilestoneComponent
    {...defaultProps}
    milestone={createMilestone('1', mediumDescription, 'In Progress')}
  />
);

export const StatusPending = () => (
  <MilestoneComponent
    {...defaultProps}
    milestone={createMilestone('1', mediumDescription, 'Pending')}
  />
);

export const StatusTerminated = () => (
  <MilestoneComponent
    {...defaultProps}
    milestone={createMilestone('1', mediumDescription, 'Terminated')}
  />
);

// Description length variations
export const ShortDescription = () => (
  <MilestoneComponent
    {...defaultProps}
    milestone={createMilestone('1', shortDescription, 'Complete')}
  />
);

export const MediumDescription = () => (
  <MilestoneComponent
    {...defaultProps}
    milestone={createMilestone('1', mediumDescription, 'In Progress')}
  />
);

export const LongDescription = () => (
  <MilestoneComponent
    {...defaultProps}
    milestone={createMilestone('1', longDescription, 'Pending')}
  />
);

// Real-world examples
export const RealWorldComplete = () => (
  <MilestoneComponent
    {...defaultProps}
    milestone={createMilestone(
      '1',
      'Complete comprehensive literature review and identify key research gaps in the field of neurodegenerative diseases. This includes analyzing over 200 peer-reviewed publications from the last 5 years.',
      'Complete',
    )}
  />
);

export const RealWorldInProgress = () => (
  <MilestoneComponent
    {...defaultProps}
    milestone={createMilestone(
      '2',
      'Recruit and enroll 500 study participants across 10 research sites, ensuring diverse demographic representation.',
      'In Progress',
    )}
  />
);

export const RealWorldPending = () => (
  <MilestoneComponent
    {...defaultProps}
    milestone={createMilestone(
      '3',
      'Conduct preliminary statistical analysis of collected biomarker data and prepare interim findings report.',
      'Pending',
    )}
  />
);
