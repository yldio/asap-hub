import { gp2 } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import ProjectMilestone from '../ProjectMilestone';

describe('ProjectMilestone', () => {
  type Milestone = gp2.ProjectResponse['milestones'][0];
  const getMilestone = (overrides: Partial<Milestone>): Milestone => ({
    title: 'a title',
    status: 'Active',
    ...overrides,
  });
  it('renders the title', () => {
    const title = 'a milestone title';
    const milestone = getMilestone({ title });
    render(<ProjectMilestone milestone={milestone} />);
    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
  });
  it.each(gp2.projectMilestoneStatus)('renders the status - %s', (status) => {
    const milestone = getMilestone({ status });
    render(<ProjectMilestone milestone={milestone} />);
    expect(screen.getByText(status)).toBeInTheDocument();
  });
  it('if available it renders the description', () => {
    const description = 'a milestone description';
    const milestone = getMilestone({ description });
    render(<ProjectMilestone milestone={milestone} />);
    expect(screen.getByText(description)).toBeInTheDocument();
  });
  it('if available it renders the link', () => {
    const link = 'http://a-milestone-link';
    const milestone = getMilestone({ link });
    render(<ProjectMilestone milestone={milestone} />);
    expect(
      screen.getByRole('link', { name: /View Milestone/ }),
    ).toHaveAttribute('href', link);
  });
});
