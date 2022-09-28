import { render, screen } from '@testing-library/react';
import ProjectSummaryHeader from '../ProjectSummaryHeader';

describe('ProjectSummaryHeader', () => {
  const defaultProps = {
    status: 'Active' as const,
  };
  it('renders the project status', () => {
    render(<ProjectSummaryHeader {...defaultProps} />);
    expect(screen.getByText(/active/i)).toBeVisible();
  });

  it('renders the project proposed link', () => {
    const props = {
      ...defaultProps,
      projectProposalUrl: 'www.google.com',
    };
    render(<ProjectSummaryHeader {...props} />);
    expect(screen.getByText('View proposal').closest('a')).toHaveAttribute(
      'href',
      'www.google.com',
    );
  });

  it('does not render the proposed link if not available', () => {
    render(<ProjectSummaryHeader {...defaultProps} />);
    expect(screen.queryByText('View proposal')).not.toBeInTheDocument();
  });
});
