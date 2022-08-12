import { render, screen } from '@testing-library/react';
import { UserCard } from '..';

describe('UserCard', () => {
  const defaultProps = {
    id: '1',
    displayName: 'Homer Simpson',
    firstName: 'Homer',
    lastName: 'Simpson',
    degree: ['PHD'],
    projects: [],
    workingGroups: [],
    role: 'GP2 Admin',
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
    expect(screen.getByText('Homer Simpson, PHD')).toBeInTheDocument();
    rerender(<UserCard {...defaultProps} degree={['MD', 'PHD']} />);
    expect(screen.getByText('Homer Simpson, MD, PHD')).toBeInTheDocument();
  });
  it('renders user info', () => {
    render(<UserCard {...defaultProps} />);
    expect(screen.getByText('GP2 Admin')).toBeInTheDocument();
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
