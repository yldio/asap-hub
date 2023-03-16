import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import WorkingGroupDetailPage from '../WorkingGroupDetailPage';

describe('WorkingGroupDetailPage', () => {
  const defaultProps: ComponentProps<typeof WorkingGroupDetailPage> = {
    title: 'Underrepresented Populations',
    members: [],
    id: '42',
    isWorkingGroupMember: true,
    isAdministrator: false,
    outputsTotal: 0,
    upcomingTotal: 0,
    pastTotal: 0,
  };
  it('renders header', () => {
    render(<WorkingGroupDetailPage {...defaultProps} />);
    expect(screen.getByRole('banner')).toBeVisible();
  });
  it('renders the body', () => {
    render(
      <WorkingGroupDetailPage {...defaultProps}>Body</WorkingGroupDetailPage>,
    );
    expect(screen.getByText('Body')).toBeVisible();
  });
});
