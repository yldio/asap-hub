import { render, screen } from '@testing-library/react';
import WorkingGroupDetailHeader from '../WorkingGroupDetailHeader';

describe('WorkingGroupDetailHeader', () => {
  const defaultProps = {
    backHref: '/back',
    title: 'Underrepresented Populations',
    members: [],
    projects: [],
    id: '1',
  };

  it('renders title, number of members and number of projects', () => {
    render(<WorkingGroupDetailHeader {...defaultProps} />);
    expect(
      screen.getByRole('heading', { name: 'Underrepresented Populations' }),
    ).toBeVisible();
    expect(screen.getByText('0 members')).toBeVisible();
    expect(screen.getByText('0 projects')).toBeVisible();
  });

  it('renders backlink', () => {
    render(<WorkingGroupDetailHeader {...defaultProps} />);
    expect(
      screen.getByRole('link', { name: 'Chevron Left Back' }),
    ).toHaveAttribute('href', '/back');
  });

  it('renders overview tab', () => {
    render(<WorkingGroupDetailHeader {...defaultProps} />);
    expect(screen.getByRole('link', { name: 'Overview' })).toBeVisible();
  });
});
