import { render, screen } from '@testing-library/react';
import ProjectDetailHeader from '../ProjectDetailHeader';

describe('ProjectDetailHeader', () => {
  const defaultProps = {
    id: '42',
    backHref: '/back',
    title: 'Main Project',
    status: 'Active' as const,
    members: [],
    startDate: '2022-09-22T00:00:00Z',
    endDate: '2022-09-30T00:00:00Z',
    projectProposalUrl: 'www.google.pt',
    isProjectMember: true,
  };

  it('renders title, number of members and number of projects', () => {
    render(<ProjectDetailHeader {...defaultProps} />);
    expect(screen.getByRole('heading', { name: 'Main Project' })).toBeVisible();
    expect(screen.getByText('0 Members')).toBeVisible();
    expect(screen.getByText('View proposal')).toBeVisible();
  });

  it('renders backlink', () => {
    render(<ProjectDetailHeader {...defaultProps} />);
    expect(
      screen.getByRole('link', { name: 'Chevron Left Back' }),
    ).toHaveAttribute('href', '/back');
  });
  it('renders overview tab', () => {
    render(<ProjectDetailHeader {...defaultProps} />);
    expect(screen.getByRole('link', { name: 'Overview' })).toBeVisible();
  });
  it('renders resources tab if you are a member', () => {
    render(<ProjectDetailHeader {...defaultProps} isProjectMember={true} />);
    expect(screen.getByRole('link', { name: 'Resources' })).toBeVisible();
  });
  it('does not render resources tab if you are not a member', () => {
    render(<ProjectDetailHeader {...defaultProps} isProjectMember={false} />);
    expect(
      screen.queryByRole('link', { name: 'Resources' }),
    ).not.toBeInTheDocument();
  });
});
