import { render, screen } from '@testing-library/react';
import UserDetailHeader from '../UserDetailHeader';

describe('UserDetailHeader', () => {
  const defaultProps = {
    backHref: '/back',
    id: '1',
    displayName: 'Homer Simpson',
    firstName: 'Homer',
    lastName: 'Simpson',
    degrees: ['PhD' as const],
    role: 'Administrator' as const,
    region: 'Europe' as const,
  };

  it('renders name', () => {
    render(<UserDetailHeader {...defaultProps} />);
    expect(
      screen.getByRole('heading', { name: 'Homer Simpson, PhD' }),
    ).toBeVisible();
  });
  it('renders the avatar', () => {
    render(<UserDetailHeader {...defaultProps} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
  it('renders back link', () => {
    render(<UserDetailHeader {...defaultProps} />);
    expect(
      screen.getByRole('link', { name: 'Chevron Left Back' }),
    ).toHaveAttribute('href', '/back');
  });
});
