import { render, screen } from '@testing-library/react';
import { UserCard } from '..';

describe('UserCard', () => {
  const defaultProps = {
    id: '1',
    displayName: 'Homer Simpson',
    firstName: 'Homer',
    lastName: 'Simpson',
    degrees: ['PhD' as const],
    projects: [],
    workingGroups: [],
    role: 'Administrator' as const,
    region: 'Europe' as const,
    tags: [
      'Genetics',
      'Neurology',
      'Operations',
      'Training',
      'Stuff',
      'More Stuff',
    ],
  };
  it('renders the avatar', () => {
    render(<UserCard {...defaultProps} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
  it('renders the name with the degrees', () => {
    const { rerender } = render(<UserCard {...defaultProps} />);
    expect(screen.getByText('Homer Simpson, PhD')).toBeInTheDocument();
    rerender(<UserCard {...defaultProps} degrees={['MD', 'PhD']} />);
    expect(screen.getByText('Homer Simpson, MD, PhD')).toBeInTheDocument();
  });
  it('renders user info', () => {
    render(<UserCard {...defaultProps} />);
    expect(screen.getByText('Administrator')).toBeInTheDocument();
    expect(
      screen.getByText('Europe', { selector: 'span' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('This member isn’t part of any working groups'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('This member isn’t part of any projects'),
    ).toBeInTheDocument();
  });
  it('renders the tags', () => {
    render(<UserCard {...defaultProps} />);
    expect(
      screen.getAllByRole('listitem').map(({ textContent }) => textContent),
    ).toMatchObject(['Genetics', 'Neurology', 'Operations', 'Training', '']);
  });
});
