import { render, screen } from '@testing-library/react';
import UserDetailPage from '../UserDetailPage';

describe('UserDetailPage', () => {
  const defaultProps = {
    backHref: '/back',
    id: '1',
    displayName: 'Homer Simpson',
    firstName: 'Homer',
    lastName: 'Simpson',
    degrees: ['PhD' as const],
    role: 'Administrator' as const,
    region: 'Europe' as const,
    positions: [
      {
        role: 'Safety Inspector',
        department: 'Sector 7G',
        institution: 'Springfield Nuclear Power Plant',
      },
    ],
    country: 'USA',
    city: 'Springfield',
  };
  it('renders header', () => {
    render(<UserDetailPage {...defaultProps}></UserDetailPage>);
    expect(screen.getByRole('banner')).toBeVisible();
  });
  it('renders the body', () => {
    render(<UserDetailPage {...defaultProps}>Body</UserDetailPage>);
    expect(screen.getByText('Body')).toBeVisible();
  });
});
