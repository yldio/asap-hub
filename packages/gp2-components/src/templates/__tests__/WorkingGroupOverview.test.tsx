import { render, screen } from '@testing-library/react';
import WorkingGroupOverview from '../WorkingGroupOverview';

describe('WorkingGroupOverview', () => {
  const defaultProps = {
    description: 'this is a description',
    primaryEmail: 'primary@example.com',
    milestones: [],
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
      screen.getByRole('heading', { name: 'Contact Details' }),
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

  it('renders the events', () => {
    render(
      <WorkingGroupOverview
        {...defaultProps}
        calendar={{ id: '42', name: 'test' }}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Events' })).toBeVisible();
  });

  it('does not renders the events if there is no calendar', () => {
    render(<WorkingGroupOverview {...defaultProps} calendar={undefined} />);

    expect(
      screen.queryByRole('heading', { name: 'Events' }),
    ).not.toBeInTheDocument();
  });

  it('displays the milestones', () => {
    render(
      <WorkingGroupOverview
        {...defaultProps}
        milestones={[{ title: 'the milestone', status: 'Active' }]}
      />,
    );
    expect(
      screen.getByRole('heading', { name: 'Working Group Milestones (1)' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /the milestone/ }),
    ).toBeInTheDocument();
  });
});
