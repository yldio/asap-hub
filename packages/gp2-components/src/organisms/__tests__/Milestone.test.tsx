import { gp2 } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import Milestone from '../Milestone';

describe('Milestone', () => {
  type Milestone = gp2.Milestone;
  const getMilestone = (overrides: Partial<Milestone>): Milestone => ({
    title: 'a title',
    status: 'Active',
    ...overrides,
  });

  it('renders the title', () => {
    const title = 'a milestone title';
    const milestone = getMilestone({ title });
    render(<Milestone milestone={milestone} />);
    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
  });

  it.each(gp2.milestoneStatus)('renders the status - %s', (status) => {
    const milestone = getMilestone({ status });
    render(<Milestone milestone={milestone} />);
    expect(screen.getByText(status)).toBeInTheDocument();
  });

  it('if available it renders the description', () => {
    const description = 'a milestone description';
    const milestone = getMilestone({ description });
    render(<Milestone milestone={milestone} />);
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('if available it renders the link', () => {
    const link = 'http://a-milestone-link';
    const milestone = getMilestone({ link });
    render(<Milestone milestone={milestone} />);
    expect(
      screen.getByRole('link', { name: /View Milestone/ }),
    ).toHaveAttribute('href', link);
  });
});
