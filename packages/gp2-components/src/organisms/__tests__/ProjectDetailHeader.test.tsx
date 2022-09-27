import { render, screen } from '@testing-library/react';
import ProjectDetailHeader from '../ProjectDetailHeader';

describe('ProjectDetailHeader', () => {
  const defaultProps = {
    backHref: '/back',
    title: 'Main Project',
    status: 'Active' as const,
    members: [],
    startDate: '2022-09-22',
    endDate: '2022-09-30',
    projectProposalUrl: '',
  };

  it('renders title, number of members and number of projects', () => {
    render(<ProjectDetailHeader {...defaultProps} />);
    expect(screen.getByRole('heading', { name: 'Main Project' })).toBeVisible();
    expect(screen.getByText('0 members')).toBeVisible();
  });

  it('renders backlink', () => {
    render(<ProjectDetailHeader {...defaultProps} />);
    expect(
      screen.getByRole('link', { name: 'Chevron Left Back' }),
    ).toHaveAttribute('href', '/back');
  });
});
