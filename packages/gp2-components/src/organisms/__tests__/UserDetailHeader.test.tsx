import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import UserDetailHeader from '../UserDetailHeader';

describe('UserDetailHeader', () => {
  const position = {
    role: 'Safety Inspector',
    department: 'Sector 7G',
    institution: 'Springfield Nuclear Power Plant',
  };
  const defaultProps: ComponentProps<typeof UserDetailHeader> = {
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
    outputsTotal: 0,
    upcomingTotal: 0,
    pastTotal: 0,
  };
  it('renders only the name', () => {
    render(<UserDetailHeader {...defaultProps} degrees={[]} />);
    expect(
      screen.getByRole('heading', { name: 'Homer Simpson' }),
    ).toBeVisible();
  });
  it('renders overview tab', () => {
    render(<UserDetailHeader {...defaultProps} />);
    expect(screen.getByRole('link', { name: 'Overview' })).toBeVisible();
  });
  it('renders outputs tab with the count', () => {
    render(<UserDetailHeader {...defaultProps} outputsTotal={42} />);
    expect(
      screen.getByRole('link', { name: /shared outputs \(42\)/i }),
    ).toBeVisible();
  });
  it('renders upcoming events tab with the count', () => {
    render(<UserDetailHeader {...defaultProps} upcomingTotal={42} />);
    expect(
      screen.getByRole('link', { name: /upcoming events \(42\)/i }),
    ).toBeVisible();
  });
  it('renders past events tab with the count', () => {
    render(<UserDetailHeader {...defaultProps} pastTotal={42} />);
    expect(
      screen.getByRole('link', { name: /past events \(42\)/i }),
    ).toBeVisible();
  });
});
