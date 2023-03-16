import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import UserDetailPage from '../UserDetailPage';

describe('UserDetailPage', () => {
  const defaultProps: ComponentProps<typeof UserDetailPage> = {
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
    outputsTotal: 0,
    upcomingTotal: 0,
    pastTotal: 0,
  };
  it('renders header', () => {
    render(<UserDetailPage {...defaultProps} />);
    expect(screen.getByRole('banner')).toBeVisible();
  });
  it('renders the body', () => {
    render(<UserDetailPage {...defaultProps}>Body</UserDetailPage>);
    expect(screen.getByText('Body')).toBeVisible();
  });
});
