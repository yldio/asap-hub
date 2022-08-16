import { render, screen } from '@testing-library/react';
import { WorkingGroupCard } from '..';

describe('WorkingGroupCard', () => {
  const defaultProps = {
    id: '42',
    title: 'Working Group 42',
    members: [],
    shortDescription: 'This is a short description',
    leadingMembers: 'This is a list of leading members',
  };
  it('renders the title', () => {
    render(<WorkingGroupCard {...defaultProps} />);
    expect(
      screen.getByRole('heading', { level: 3, name: /Working Group 42/i }),
    ).toBeInTheDocument();
  });
  it('links to the detail page', () => {
    render(<WorkingGroupCard {...defaultProps} />);
    expect(
      screen.getByRole('link', { name: /Working Group 42/i }),
    ).toBeInTheDocument();
  });
  it('renders a count of the members', () => {
    render(<WorkingGroupCard {...defaultProps} />);
    expect(screen.getByText(/0 members/i)).toBeInTheDocument();
  });
  it('renders the short description', () => {
    render(<WorkingGroupCard {...defaultProps} />);
    expect(
      screen.getByText(/This is a short description/i),
    ).toBeInTheDocument();
  });
  it('renders the leading members', () => {
    render(<WorkingGroupCard {...defaultProps} />);
    expect(
      screen.getByText(/This is a list of leading members/i),
    ).toBeInTheDocument();
  });
});
