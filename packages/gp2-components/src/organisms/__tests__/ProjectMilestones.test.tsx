import { gp2 } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import ProjectMilestones from '../ProjectMilestones';

describe('ProjectMilestones', () => {
  type Milestone = gp2.ProjectResponse['milestones'][0];
  const getMilestones = (length = 1): Milestone[] =>
    Array.from({ length }, (_, itemIndex) => ({
      id: `itemIndex`,
      title: `a title ${itemIndex}`,
      status: 'Active',
    }));
  it('renders the title when there are no milestons', () => {
    render(<ProjectMilestones milestones={[]} />);
    expect(
      screen.getByRole('heading', { name: 'Project Milestones (0)' }),
    ).toBeInTheDocument();
  });
  it('renders the title with the correct count', () => {
    render(<ProjectMilestones milestones={getMilestones(11)} />);
    expect(
      screen.getByRole('heading', { name: 'Project Milestones (11)' }),
    ).toBeInTheDocument();
  });

  it('renders a milestones', () => {
    render(<ProjectMilestones milestones={getMilestones(2)} />);
    expect(
      screen.getByRole('heading', { name: 'a title 0' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'a title 1' }),
    ).toBeInTheDocument();
  });
});
