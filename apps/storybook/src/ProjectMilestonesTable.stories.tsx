import {
  ProjectMilestonesTable,
  ResearchOutputOption,
} from '@asap-hub/react-components';
import { GrantType, Milestone } from '@asap-hub/model';

export default {
  title: 'Organisms / Project Milestones',
  component: ProjectMilestonesTable,
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
  isLead: true as const,
  loadArticleOptions: mockLoadArticleOptions,
  selectedGrantType: 'supplement' as GrantType,
  pageControlsProps: {
    numberOfPages: 1,
    currentPageIndex: 0,
    renderPageHref: (index: number) => `#${index}`,
  },
  fetchLinkedArticles: mockFetchArticles,
};

const createMilestone = (
  id: string,
  description: string,
  status: Milestone['status'],
  aims?: string,
  articleCount: number = 0,
): Milestone => ({
  id,
  description,
  status,
  ...(aims !== undefined && { aims }),
  articleCount,
});

const shortDescription = 'Complete initial research and literature review.';

const mediumDescription =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

const longDescription =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

export const Default = () => (
  <ProjectMilestonesTable
    {...defaultProps}
    milestones={[
      createMilestone('1', longDescription, 'Complete', '1'),
      createMilestone('2', mediumDescription, 'In Progress', '1,2'),
      createMilestone('3', longDescription, 'Pending', '2'),
      createMilestone('4', shortDescription, 'Complete', '2,3,4'),
    ]}
  />
);

export const WithMoreMilestones = () => (
  <ProjectMilestonesTable
    {...defaultProps}
    milestones={[
      createMilestone('1', longDescription, 'Complete', '1'),
      createMilestone('2', mediumDescription, 'In Progress', '1,2'),
      createMilestone('3', longDescription, 'Pending', '2'),
      createMilestone('4', shortDescription, 'Complete', '2,3'),
      createMilestone('5', mediumDescription, 'Terminated', '2,3,4,5,6'),
      createMilestone('6', longDescription, 'Terminated', '3'),
      createMilestone('7', shortDescription, 'Complete', '3,5'),
      createMilestone('8', mediumDescription, 'In Progress', '4'),
    ]}
  />
);

export const AllStatuses = () => (
  <ProjectMilestonesTable
    {...defaultProps}
    milestones={[
      createMilestone('1', 'This milestone is complete.', 'Complete', '1'),
      createMilestone(
        '2',
        'This milestone is in progress.',
        'In Progress',
        '1,2',
      ),
      createMilestone('3', 'This milestone is pending.', 'Pending', '2'),
      createMilestone('4', 'This milestone is terminated.', 'Terminated', '3'),
    ]}
  />
);

export const ShortDescriptions = () => (
  <ProjectMilestonesTable
    {...defaultProps}
    milestones={[
      createMilestone('1', 'Complete literature review.', 'Complete', '1'),
      createMilestone('2', 'Analyze initial data.', 'In Progress', '1,2'),
      createMilestone('3', 'Prepare interim report.', 'Pending', '2'),
      createMilestone('4', 'Submit findings.', 'Complete', '2,3'),
    ]}
  />
);

export const LongDescriptions = () => (
  <ProjectMilestonesTable
    {...defaultProps}
    milestones={[
      createMilestone('1', longDescription, 'Complete', '1'),
      createMilestone('2', longDescription, 'In Progress', '1,2'),
      createMilestone('3', longDescription, 'Pending', '2,3,4,5,6'),
      createMilestone('4', longDescription, 'Complete', '3'),
    ]}
  />
);

export const SingleMilestone = () => (
  <ProjectMilestonesTable
    {...defaultProps}
    milestones={[createMilestone('1', mediumDescription, 'In Progress', '1')]}
  />
);

export const WithEmptyAims = () => (
  <ProjectMilestonesTable
    {...defaultProps}
    milestones={[
      createMilestone('1', 'Milestone with aim 1.', 'Complete', '1'),
      createMilestone('2', 'Milestone with no aims.', 'In Progress'),
      createMilestone('3', 'Milestone with multiple aims.', 'Pending', '2,3,4'),
    ]}
  />
);

export const TwoMilestones = () => (
  <ProjectMilestonesTable
    {...defaultProps}
    milestones={[
      createMilestone('1', longDescription, 'Complete', '1'),
      createMilestone('2', mediumDescription, 'In Progress', '1,2'),
    ]}
  />
);

export const SixMilestones = () => (
  <ProjectMilestonesTable
    {...defaultProps}
    milestones={[
      createMilestone('1', longDescription, 'Complete', '1'),
      createMilestone('2', mediumDescription, 'In Progress', '1,2'),
      createMilestone('3', longDescription, 'Pending', '2'),
      createMilestone('4', shortDescription, 'Complete', '2,3,4,5,6'),
      createMilestone('5', mediumDescription, 'Terminated', '3'),
      createMilestone('6', longDescription, 'Terminated', '3,5'),
    ]}
  />
);

export const RealWorldExample = () => (
  <ProjectMilestonesTable
    {...defaultProps}
    milestones={[
      createMilestone(
        '1',
        'Complete comprehensive literature review and identify key research gaps in the field of neurodegenerative diseases.',
        'Complete',
        '1',
      ),
      createMilestone(
        '2',
        'Recruit and enroll 500 study participants across 10 research sites, ensuring diverse demographic representation.',
        'In Progress',
        '1,2',
      ),
      createMilestone(
        '3',
        'Establish data sharing protocols and create centralized database infrastructure for multi-site collaboration. This includes setting up secure data transfer mechanisms and ensuring HIPAA compliance.',
        'In Progress',
        '2,3',
      ),
      createMilestone(
        '4',
        'Conduct preliminary statistical analysis of collected biomarker data and prepare interim findings report for steering committee review.',
        'Pending',
        '2,3,4,5,6',
      ),
      createMilestone(
        '5',
        'Submit manuscript to peer-reviewed journal and present findings at international neuroscience conference.',
        'Pending',
        '3',
      ),
    ]}
  />
);
