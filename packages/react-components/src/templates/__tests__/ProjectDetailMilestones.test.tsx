import { render, screen } from '@testing-library/react';
import { Milestone } from '@asap-hub/model';

import ProjectDetailMilestones from '../ProjectDetailMilestones';

const pageControlsProps = {
  numberOfPages: 3,
  currentPageIndex: 1,
  renderPageHref: (index: number) => `/page/${index}`,
};

const mockMilestones: Milestone[] = [
  {
    id: '1',
    description: 'First milestone',
    status: 'Complete',
  },
  {
    id: '2',
    description: 'Second milestone',
    status: 'In Progress',
  },
];

describe('ProjectDetailMilestones', () => {
  it('renders empty state when there are no milestones', () => {
    render(<ProjectDetailMilestones milestones={[]} />);

    expect(screen.getByText('Milestones')).toBeInTheDocument();
    expect(
      screen.getByText(
        /These milestones track progress toward the objectives of the Original Grant/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Articles associated with a milestone may be added at any status/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'No milestones related to the Original Grant have been added to this project yet.',
      ),
    ).toBeInTheDocument();

    // Page controls should not be rendered for empty state
    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });

  it('renders milestones table and pagination when milestones are provided', () => {
    render(
      <ProjectDetailMilestones
        milestones={mockMilestones}
        pageControlsProps={pageControlsProps}
      />,
    );

    // ProjectMilestones heading and description
    expect(screen.getAllByText('Milestones').length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByText('The milestones of this project are:'),
    ).toBeInTheDocument();

    // Milestone rows
    expect(screen.getByText('First milestone')).toBeInTheDocument();
    expect(screen.getByText('Second milestone')).toBeInTheDocument();

    // PageControls numbers
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
