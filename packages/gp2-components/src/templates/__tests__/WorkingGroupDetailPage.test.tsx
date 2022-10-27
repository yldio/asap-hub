import { render, screen } from '@testing-library/react';
import WorkingGroupDetailPage from '../WorkingGroupDetailPage';

describe('WorkingGroupDetailPage', () => {
  const defaultProps = {
    backHref: '/back',
    title: 'Underrepresented Populations',
    members: [],
    id: '42',
    isWorkingGroupMember: true,
  };
  it('renders header', () => {
    render(<WorkingGroupDetailPage {...defaultProps}></WorkingGroupDetailPage>);
    expect(screen.getByRole('banner')).toBeVisible();
  });
  it('renders the body', () => {
    render(
      <WorkingGroupDetailPage {...defaultProps}>Body</WorkingGroupDetailPage>,
    );
    expect(screen.getByText('Body')).toBeVisible();
  });
});
