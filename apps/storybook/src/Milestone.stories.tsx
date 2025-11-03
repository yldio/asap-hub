import { Milestone as MilestoneComponent } from '@asap-hub/react-components';
import { Milestone } from '@asap-hub/model';

export default {
  title: 'Organisms / Milestone',
  component: MilestoneComponent,
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

// Status variations
export const StatusComplete = () => (
  <MilestoneComponent
    milestone={createMilestone('1', mediumDescription, 'Complete')}
  />
);

export const StatusInProgress = () => (
  <MilestoneComponent
    milestone={createMilestone('1', mediumDescription, 'In Progress')}
  />
);

export const StatusPending = () => (
  <MilestoneComponent
    milestone={createMilestone('1', mediumDescription, 'Pending')}
  />
);

export const StatusIncomplete = () => (
  <MilestoneComponent
    milestone={createMilestone('1', mediumDescription, 'Incomplete')}
  />
);

export const StatusNotStarted = () => (
  <MilestoneComponent
    milestone={createMilestone('1', mediumDescription, 'Not Started')}
  />
);

// Description length variations
export const ShortDescription = () => (
  <MilestoneComponent
    milestone={createMilestone('1', shortDescription, 'Complete')}
  />
);

export const MediumDescription = () => (
  <MilestoneComponent
    milestone={createMilestone('1', mediumDescription, 'In Progress')}
  />
);

export const LongDescription = () => (
  <MilestoneComponent
    milestone={createMilestone('1', longDescription, 'Pending')}
  />
);

// Real-world examples
export const RealWorldComplete = () => (
  <MilestoneComponent
    milestone={createMilestone(
      '1',
      'Complete comprehensive literature review and identify key research gaps in the field of neurodegenerative diseases. This includes analyzing over 200 peer-reviewed publications from the last 5 years.',
      'Complete',
    )}
  />
);

export const RealWorldInProgress = () => (
  <MilestoneComponent
    milestone={createMilestone(
      '2',
      'Recruit and enroll 500 study participants across 10 research sites, ensuring diverse demographic representation.',
      'In Progress',
    )}
  />
);

export const RealWorldPending = () => (
  <MilestoneComponent
    milestone={createMilestone(
      '3',
      'Conduct preliminary statistical analysis of collected biomarker data and prepare interim findings report.',
      'Pending',
    )}
  />
);
