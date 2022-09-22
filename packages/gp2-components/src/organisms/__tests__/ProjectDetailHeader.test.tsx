import { render, screen } from '@testing-library/react';
import ProjectDetailHeader from '../ProjectDetailHeader';

describe('ProjectDetailHeader', () => {
  const defaultProps = {
    backHref: '/back',
    title: 'Main Project',
    members: [],
    projects: [],
    id: '1',
  };

  it('renders title, number of members and number of projects', () => {
    render(<ProjectDetailHeader {...defaultProps} />);
    expect(screen.getByRole('heading', { name: 'Main Project' })).toBeVisible();
    expect(screen.getByText('0 members')).toBeVisible();
    expect(screen.getByText('0 projects')).toBeVisible();
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
});
