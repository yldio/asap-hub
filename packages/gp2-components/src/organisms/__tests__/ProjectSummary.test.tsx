import { render, screen } from '@testing-library/react';
import ProjectSummary from '../ProjectSummary';

describe('UserCard', () => {
  const defaultProps = {
    status: 'Active' as const,
  };
  it('renders the project status', () => {
    render(<ProjectSummary {...defaultProps} />);
    expect(screen.getByText(/active/i)).toBeVisible();
  });

  it('renders the project proposed link', () => {
    const props = {
      ...defaultProps,
      projectProposalUrl: 'www.google.com',
    };
    render(<ProjectSummary {...props} />);
    expect(screen.getByText('View proposal').closest('a')).toHaveAttribute(
      'href',
      'www.google.com',
    );
  });

  it('does not render the proposed link if not available', () => {
    render(<ProjectSummary {...defaultProps} />);
    expect(screen.queryByText('View proposal')).not.toBeInTheDocument();
  });
});
