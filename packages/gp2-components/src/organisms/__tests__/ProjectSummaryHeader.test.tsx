import { render, screen } from '@testing-library/react';
import ProjectSummaryHeader from '../ProjectSummaryHeader';

describe('ProjectSummaryHeader', () => {
  const defaultProps = {
    status: 'Active' as const,
    traineeProject: false,
  };
  it('renders the project status', () => {
    render(<ProjectSummaryHeader {...defaultProps} />);
    expect(screen.getByText(/active/i)).toBeVisible();
  });
  it('render the traineeProject pill if true', () => {
    render(<ProjectSummaryHeader {...defaultProps} traineeProject />);
    expect(screen.getByText(/trainee project/i)).toBeVisible();
  });
  it('render the opportunities available pill if theres a link', () => {
    render(
      <ProjectSummaryHeader
        {...defaultProps}
        opportunitiesLink={'something'}
      />,
    );
    expect(screen.getByText(/opportunities available/i)).toBeVisible();
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
