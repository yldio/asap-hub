import { ProjectMilestones } from '@asap-hub/react-components';
import { Milestone } from '@asap-hub/model';

export default {
  title: 'Organisms / Project Milestones',
  component: ProjectMilestones,
};

const createMilestone = (
  id: string,
  description: string,
  status: Milestone['status'],
): Milestone => ({
  id,
  title: `Milestone ${id}`,
  description,
  status,
});

const shortDescription = 'Complete initial research and literature review.';

const mediumDescription =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

const longDescription =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

export const Default = () => (
  <ProjectMilestones
    milestones={[
      createMilestone('1', longDescription, 'Complete'),
      createMilestone('2', mediumDescription, 'In Progress'),
      createMilestone('3', longDescription, 'Pending'),
      createMilestone('4', shortDescription, 'Complete'),
    ]}
  />
);

export const WithMoreMilestones = () => (
  <ProjectMilestones
    milestones={[
      createMilestone('1', longDescription, 'Complete'),
      createMilestone('2', mediumDescription, 'In Progress'),
      createMilestone('3', longDescription, 'Pending'),
      createMilestone('4', shortDescription, 'Complete'),
      createMilestone('5', mediumDescription, 'Incomplete'),
      createMilestone('6', longDescription, 'Not Started'),
      createMilestone('7', shortDescription, 'Complete'),
      createMilestone('8', mediumDescription, 'In Progress'),
    ]}
  />
);

export const AllStatuses = () => (
  <ProjectMilestones
    milestones={[
      createMilestone('1', 'This milestone is complete.', 'Complete'),
      createMilestone('2', 'This milestone is in progress.', 'In Progress'),
      createMilestone('3', 'This milestone is pending.', 'Pending'),
      createMilestone('4', 'This milestone is incomplete.', 'Incomplete'),
      createMilestone('5', 'This milestone has not started.', 'Not Started'),
    ]}
  />
);

export const ShortDescriptions = () => (
  <ProjectMilestones
    milestones={[
      createMilestone('1', 'Complete literature review.', 'Complete'),
      createMilestone('2', 'Analyze initial data.', 'In Progress'),
      createMilestone('3', 'Prepare interim report.', 'Pending'),
      createMilestone('4', 'Submit findings.', 'Complete'),
    ]}
  />
);

export const LongDescriptions = () => (
  <ProjectMilestones
    milestones={[
      createMilestone('1', longDescription, 'Complete'),
      createMilestone('2', longDescription, 'In Progress'),
      createMilestone('3', longDescription, 'Pending'),
      createMilestone('4', longDescription, 'Complete'),
    ]}
  />
);

export const SingleMilestone = () => (
  <ProjectMilestones
    milestones={[createMilestone('1', mediumDescription, 'In Progress')]}
  />
);

export const TwoMilestones = () => (
  <ProjectMilestones
    milestones={[
      createMilestone('1', longDescription, 'Complete'),
      createMilestone('2', mediumDescription, 'In Progress'),
    ]}
  />
);

export const CustomInitialDisplayCount = () => (
  <ProjectMilestones
    milestones={[
      createMilestone('1', longDescription, 'Complete'),
      createMilestone('2', mediumDescription, 'In Progress'),
      createMilestone('3', longDescription, 'Pending'),
      createMilestone('4', shortDescription, 'Complete'),
      createMilestone('5', mediumDescription, 'Incomplete'),
      createMilestone('6', longDescription, 'Not Started'),
    ]}
    initialDisplayCount={2}
  />
);

export const RealWorldExample = () => (
  <ProjectMilestones
    milestones={[
      createMilestone(
        '1',
        'Complete comprehensive literature review and identify key research gaps in the field of neurodegenerative diseases.',
        'Complete',
      ),
      createMilestone(
        '2',
        'Recruit and enroll 500 study participants across 10 research sites, ensuring diverse demographic representation.',
        'In Progress',
      ),
      createMilestone(
        '3',
        'Establish data sharing protocols and create centralized database infrastructure for multi-site collaboration. This includes setting up secure data transfer mechanisms and ensuring HIPAA compliance.',
        'In Progress',
      ),
      createMilestone(
        '4',
        'Conduct preliminary statistical analysis of collected biomarker data and prepare interim findings report for steering committee review.',
        'Pending',
      ),
      createMilestone(
        '5',
        'Submit manuscript to peer-reviewed journal and present findings at international neuroscience conference.',
        'Pending',
      ),
    ]}
  />
);
