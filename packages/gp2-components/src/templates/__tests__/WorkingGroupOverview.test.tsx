import { render, screen } from '@testing-library/react';
import WorkingGroupOverview from '../WorkingGroupOverview';

describe('WorkingGroupOverview', () => {
  const defaultProps = {
    description: 'this is a description',
    primaryEmail: 'primary@example.com',
    members: [],
  };
  it('renders the description', () => {
    render(<WorkingGroupOverview {...defaultProps} />);
    expect(
      screen.getByRole('heading', { name: 'Description' }),
    ).toBeInTheDocument();
  });
  it('renders the contact information', () => {
    render(<WorkingGroupOverview {...defaultProps} />);
    expect(
      screen.getByRole('heading', { name: 'Contact Information' }),
    ).toBeInTheDocument();
  });
  it('renders the members list', () => {
    render(
      <WorkingGroupOverview
        {...defaultProps}
        members={[
          {
            userId: 'uuid',
            firstName: 'John',
            lastName: 'Doe',
            role: 'Lead',
          },
        ]}
      >
        Body
      </WorkingGroupOverview>,
    );

    expect(screen.getByText('Working Group Members (1)')).toBeInTheDocument();
    const avatar = screen.getByText(/john doe/i);
    expect(avatar).toBeVisible();
    expect(avatar.closest('a')).toHaveAttribute(
      'href',
      expect.stringMatching(/uuid/i),
    );
    expect(screen.getByText('Lead')).toBeInTheDocument();
  });

  it('renders the member list if there are no members. It displays a count of 0', () => {
    render(
      <WorkingGroupOverview {...defaultProps} members={[]}>
        Body
      </WorkingGroupOverview>,
    );
    expect(screen.getByText('Working Group Members (0)')).toBeInTheDocument();
  });
});
