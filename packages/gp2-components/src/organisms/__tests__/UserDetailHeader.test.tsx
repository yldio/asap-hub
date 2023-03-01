import { render, screen } from '@testing-library/react';
import UserDetailHeader from '../UserDetailHeader';

describe('UserDetailHeader', () => {
  const position = {
    role: 'Safety Inspector',
    department: 'Sector 7G',
    institution: 'Springfield Nuclear Power Plant',
  };
  const defaultProps = {
    backHref: '/back',
    id: '1',
    displayName: 'Homer Simpson',
    firstName: 'Homer',
    lastName: 'Simpson',
    degrees: ['PhD' as const],
    role: 'Administrator' as const,
    region: 'Europe' as const,
    positions: [position],
    country: 'USA',
    city: 'Springfield',
  };
  it('renders only the name', () => {
    render(<UserDetailHeader {...defaultProps} degrees={[]} />);
    expect(
      screen.getByRole('heading', { name: 'Homer Simpson' }),
    ).toBeVisible();
  });
});
